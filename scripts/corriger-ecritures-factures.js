// scripts/corriger-ecritures-factures.js
import { db } from '../src/core/database/connection.js';
import { JournalService } from '../src/modules/comptabilite/services/JournalService.js';

async function corrigerEcrituresFactures() {
  const journalService = new JournalService();
  
  try {
    console.log('🔍 Recherche des factures validées sans écritures comptables...');
    
    // Récupérer toutes les factures validées
    const facturesValidees = await db('factures')
      .where('statut', 'validee')
      .select('*');
    
    console.log(`📋 ${facturesValidees.length} facture(s) validée(s) trouvée(s)`);
    
    let compteur = 0;
    
    for (const facture of facturesValidees) {
      // Vérifier si des écritures existent déjà pour cette facture
      const ecrituresExistantes = await db('ecritures_comptables')
        .where('reference', facture.numero_facture.toString())
        .select('id_ecriture');
      
      if (ecrituresExistantes.length === 0) {
        console.log(`📝 Génération des écritures pour la facture ${facture.numero_facture}...`);
        await journalService.genererEcritureFacture(facture);
        compteur++;
        console.log(`✅ Écritures générées pour la facture ${facture.numero_facture}`);
      } else {
        console.log(`⏭️ Écritures déjà existantes pour la facture ${facture.numero_facture}`);
      }
    }
    
    console.log(`🎉 Correction terminée ! ${compteur} facture(s) ont été traitées.`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
    console.error(error.stack);
  } finally {
    process.exit(0); // Juste quitter le processus plutôt que db.destroy()
  }
}

// Exécuter le script
corrigerEcrituresFactures().catch(console.error);