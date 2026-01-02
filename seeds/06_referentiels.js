export async function seed(knex) {
  // Plan comptable
  await knex('plan_comptable').insert([
    { numero_compte: '401000', libelle: 'Fournisseurs', type_compte: 'passif', categorie: 'fournisseur' },
    { numero_compte: '411000', libelle: 'Clients', type_compte: 'actif', categorie: 'client' },
    { numero_compte: '445620', libelle: 'TVA déductible', type_compte: 'actif', categorie: 'tva' },
    { numero_compte: '445710', libelle: 'TVA collectée', type_compte: 'passif', categorie: 'tva' },
    { numero_compte: '512000', libelle: 'Banque', type_compte: 'actif', categorie: 'banque' },
    { numero_compte: '530000', libelle: 'Caisse', type_compte: 'actif', categorie: 'caisse' },
    { numero_compte: '607000', libelle: 'Achats de marchandises', type_compte: 'charge', categorie: 'achat' },
    { numero_compte: '701000', libelle: 'Ventes de produits', type_compte: 'produit', categorie: 'vente' }
  ]);

  // Types de facture
  await knex('referentiel_types_facture').insert([
    { code: 'proforma', libelle: 'Proforma' },
    { code: 'facture', libelle: 'Facture' },
    { code: 'avoir', libelle: 'Avoir' }
  ]);

  // Modes de paiement
  await knex('referentiel_modes_paiement').insert([
    { code: 'espece', libelle: 'Espèce' },
    { code: 'virement', libelle: 'Virement' },
    { code: 'cheque', libelle: 'Chèque' },
    { code: 'carte', libelle: 'Carte' }
  ]);

  // Taux de TVA
  await knex('referentiel_taux_tva').insert([
    { taux: 0.00, libelle: 'Exonéré' },
    { taux: 5.00, libelle: 'TVA 5%' },
    { taux: 10.00, libelle: 'TVA 10%' },
    { taux: 20.00, libelle: 'TVA 20%' }
  ]);
}