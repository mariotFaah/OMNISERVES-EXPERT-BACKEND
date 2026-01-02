// scripts/nettoyer-ecritures-test.js
import { db } from '../src/core/database/connection.js';
import { JournalService } from '../src/modules/comptabilite/services/JournalService.js';

async function nettoyerEtRegenererEcritures() {
  console.log('🧹 Nettoyage complet des écritures...');
  
  const journalService = new JournalService();
  
  // 1. Supprimer TOUTES les écritures existantes
  await db('ecritures_comptables').del();
  console.log('✅ Toutes les anciennes écritures supprimées');
  
  // 2. Récupérer TOUTES les factures validées
  const facturesValidees = await db('factures').where('statut', 'validee');
  console.log(`📋 ${facturesValidees.length} factures validées à traiter`);
  
  // 3. Régénérer les écritures pour chaque facture
  for (const facture of facturesValidees) {
    console.log(`🔄 Traitement facture ${facture.numero_facture}...`);
    await journalService.genererEcritureFacture(facture);
  }
  
  console.log('✅ Toutes les écritures régénérées');
  
  // 4. Vérifier le résultat
  const toutesEcritures = await db('ecritures_comptables').select('*');
  console.log(`📊 Total écritures créées: ${toutesEcritures.length}`);
  
  console.log('🔍 Détail par compte:');
  const parCompte = await db('ecritures_comptables')
    .groupBy('compte')
    .select('compte')
    .sum('debit as total_debit')
    .sum('credit as total_credit');
  
  parCompte.forEach(compte => {
    const solde = parseFloat(compte.total_debit) - parseFloat(compte.total_credit);
    console.log(`- ${compte.compte}: Débit ${compte.total_debit} | Crédit ${compte.total_credit} | Solde ${solde}`);
  });
}

nettoyerEtRegenererEcritures().catch(console.error);
