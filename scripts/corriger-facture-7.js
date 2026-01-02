// scripts/corriger-facture-7.js
import { db } from '../src/core/database/connection.js';
import { JournalService } from '../src/modules/comptabilite/services/JournalService.js';

async function corrigerFacture7() {
  console.log('🔧 Correction de la facture 7...');
  
  const journalService = new JournalService();
  
  // 1. Supprimer les anciennes écritures de la facture 7
  await db('ecritures_comptables').where('reference', '7').del();
  console.log('✅ Anciennes écritures facture 7 supprimées');
  
  // 2. Récupérer la facture 7
  const facture7 = await db('factures')
    .where('numero_facture', 7)
    .first();
  
  if (!facture7) {
    console.log('❌ Facture 7 non trouvée');
    return;
  }
  
  console.log('📋 Facture 7 trouvée:', facture7);
  
  // 3. Régénérer les écritures avec la logique corrigée
  await journalService.genererEcritureFacture(facture7);
  console.log('✅ Nouvelles écritures facture 7 créées');
  
  // 4. Vérifier le résultat
  const nouvellesEcritures = await db('ecritures_comptables')
    .where('reference', '7')
    .select('*');
  
  console.log('🔍 Nouvelles écritures:');
  nouvellesEcritures.forEach(ecriture => {
    console.log(`- ${ecriture.numero_ecriture}: ${ecriture.compte} | Débit: ${ecriture.debit} | Crédit: ${ecriture.credit}`);
  });
}

corrigerFacture7().catch(console.error);
