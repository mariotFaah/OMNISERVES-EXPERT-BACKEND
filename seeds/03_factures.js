import { db } from '../src/core/database/connection.js';

export async function seed(knex) {
  // Insérer des factures
  await db('factures').insert([
    {
      numero_facture: 1,
      date: '2024-12-01',
      type_facture: 'facture',
      id_tiers: 1,
      echeance: '2024-12-31',
      reglement: 'virement',
      total_ht: 2580000,
      total_tva: 516000,
      total_ttc: 3096000,
      statut: 'validee'
    },
    {
      numero_facture: 2,
      date: '2024-12-15',
      type_facture: 'proforma',
      id_tiers: 3,
      echeance: '2025-01-15',
      reglement: 'cheque',
      total_ht: 650000,
      total_tva: 0,
      total_ttc: 650000,
      statut: 'brouillon'
    }
  ]);

  // Insérer des lignes de facture
  await db('ligne_facture').insert([
    // Facture 1
    {
      id_ligne: 1,
      numero_facture: 1,
      code_article: 'ART001',
      description: 'Ordinateur Portable Dell',
      quantite: 1,
      prix_unitaire: 2500000,
      taux_tva: 20,
      remise: 0,
      montant_ht: 2500000,
      montant_tva: 500000,
      montant_ttc: 3000000
    },
    {
      id_ligne: 2,
      numero_facture: 1,
      code_article: 'ART002',
      description: 'Souris USB Logitech',
      quantite: 2,
      prix_unitaire: 15000,
      taux_tva: 20,
      remise: 10,
      montant_ht: 27000,
      montant_tva: 5400,
      montant_ttc: 32400
    },
    {
      id_ligne: 3,
      numero_facture: 1,
      code_article: 'ART004',
      description: 'Maintenance installation',
      quantite: 2,
      prix_unitaire: 150000,
      taux_tva: 20,
      remise: 0,
      montant_ht: 300000,
      montant_tva: 60000,
      montant_ttc: 360000
    },
    // Facture 2
    {
      id_ligne: 4,
      numero_facture: 2,
      code_article: 'ART005',
      description: 'Formation avancée',
      quantite: 1,
      prix_unitaire: 500000,
      taux_tva: 0,
      remise: 0,
      montant_ht: 500000,
      montant_tva: 0,
      montant_ttc: 500000
    },
    {
      id_ligne: 5,
      numero_facture: 2,
      code_article: 'ART004',
      description: 'Support technique',
      quantite: 1,
      prix_unitaire: 150000,
      taux_tva: 0,
      remise: 0,
      montant_ht: 150000,
      montant_tva: 0,
      montant_ttc: 150000
    }
  ]);

  console.log('✅ Factures et lignes insérées avec succès');
}

export async function unseed(knex) {
  await db('ligne_facture').truncate();
  await db('factures').truncate();
}