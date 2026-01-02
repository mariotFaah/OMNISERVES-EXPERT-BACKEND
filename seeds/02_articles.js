// seeds/02_articles.js (MODIFIÉ)
import { db } from '../src/core/database/connection.js';

export async function seed(knex) {
  // Insérer des articles avec données de stock
  await db('articles').insert([
    {
      code_article: 'ART001',
      description: 'Ordinateur Portable',
      prix_unitaire: 2500000,
      taux_tva: 20,
      unite: 'unite',
      quantite_stock: 10,
      seuil_alerte: 3
    },
    {
      code_article: 'ART002',
      description: 'Souris USB',
      prix_unitaire: 15000,
      taux_tva: 20,
      unite: 'unite',
      quantite_stock: 2,  // Stock faible
      seuil_alerte: 5
    },
    {
      code_article: 'ART003',
      description: 'Clavier Mécanique',
      prix_unitaire: 80000,
      taux_tva: 20,
      unite: 'unite',
      quantite_stock: 0,  // Rupture de stock
      seuil_alerte: 5
    },
    {
      code_article: 'ART004',
      description: 'Service Maintenance',
      prix_unitaire: 150000,
      taux_tva: 20,
      unite: 'heure',
      quantite_stock: 999, // Service - stock illimité
      seuil_alerte: 1
    },
    {
      code_article: 'ART005',
      description: 'Formation Logiciel',
      prix_unitaire: 500000,
      taux_tva: 0,
      unite: 'jour',
      quantite_stock: 15,
      seuil_alerte: 3
    }
  ]);

  console.log('✅ Articles insérés avec succès');
}

export async function unseed(knex) {
  await db('articles').truncate();
}