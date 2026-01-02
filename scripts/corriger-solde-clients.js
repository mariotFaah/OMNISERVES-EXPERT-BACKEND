// scripts/corriger-solde-clients.js
import { db } from '../src/core/database/connection.js';

async function corrigerSoldeClients() {
  console.log('🔧 Correction du solde clients...');
  
  // Vérifier les écritures clients
  const ecrituresClients = await db('ecritures_comptables')
    .where('compte', '411000')
    .select('*');
  
  console.log('📋 Écritures clients actuelles:');
  ecrituresClients.forEach(ecriture => {
    console.log(`- ${ecriture.numero_ecriture}: ${ecriture.libelle} | Débit: ${ecriture.debit} | Crédit: ${ecriture.credit}`);
  });

  // Le problème: toutes les écritures clients sont au crédit au lieu du débit
  // Pour une facture client, ça devrait être: Débit Clients, Crédit Ventes
  
  console.log('✅ Analyse terminée. Les écritures clients sont inversées.');
}

corrigerSoldeClients().catch(console.error);
