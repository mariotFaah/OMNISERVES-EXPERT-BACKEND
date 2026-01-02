// scripts/corriger-solde-client.js
import { db } from '../src/core/database/connection.js';

async function corrigerSoldeClient() {
  try {
    console.log('🔍 Vérification des factures payées...');
    
    // Récupérer les factures avec leurs paiements
    const factures = await db('factures as f')
      .leftJoin('paiements as p', 'f.numero_facture', 'p.numero_facture')
      .select(
        'f.numero_facture',
        'f.total_ttc',
        'f.statut',
        db.raw('COALESCE(SUM(p.montant), 0) as total_paiements')
      )
      .groupBy('f.numero_facture', 'f.total_ttc', 'f.statut');
    
    let compteur = 0;
    
    for (const facture of factures) {
      const totalPaiements = parseFloat(facture.total_paiements);
      const totalFacture = parseFloat(facture.total_ttc);
      
      if (totalPaiements >= totalFacture) {
        console.log(`💰 Facture ${facture.numero_facture} est payée (${totalPaiements}/${totalFacture})`);
        
        // Vérifier si l'écriture de contrepartie existe déjà
        const ecritureExistante = await db('ecritures_comptables')
          .where('reference', `PAY-CLIENT-${facture.numero_facture}`)
          .first();
        
        if (!ecritureExistante) {
          console.log(`📝 Génération de l'écriture de contrepartie client...`);
          
          // Créer l'écriture pour solder le client
          const date = new Date();
          const prefix = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          await db('ecritures_comptables').insert({
            numero_ecriture: `${prefix}-PAY-CLIENT-${facture.numero_facture}`,
            date: date,
            journal: 'banque',
            compte: '411000', // Clients
            libelle: `Paiement facture ${facture.numero_facture}`,
            debit: 0,
            credit: totalFacture, // On crédite le compte client (diminue la créance)
            devise: 'MGA',
            taux_change: 1,
            reference: `PAY-CLIENT-${facture.numero_facture}`
          });
          
          compteur++;
          console.log(`✅ Compte client soldé pour la facture ${facture.numero_facture}`);
        } else {
          console.log(`⏭️ Écriture déjà existante pour la facture ${facture.numero_facture}`);
        }
      }
    }
    
    console.log(`🎉 Correction terminée ! ${compteur} facture(s) soldée(s).`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

corrigerSoldeClient().catch(console.error);
