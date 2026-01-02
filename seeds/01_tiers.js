import { db } from '../src/core/database/connection.js';

export async function seed(knex) {
  // Désactiver les contraintes de clé étrangère
  await db.raw('SET FOREIGN_KEY_CHECKS = 0');
  
  // Vider les tables
  await db('ligne_facture').truncate();
  await db('factures').truncate();
  await db('articles').truncate();
  await db('tiers').truncate();
  
  // Réactiver les contraintes
  await db.raw('SET FOREIGN_KEY_CHECKS = 1');

  // Insérer des tiers
  await db('tiers').insert([
    {
      id_tiers: 1,
      nom: 'Client SARL',
      type_tiers: 'client',
      numero: 'CLI001',
      adresse: '123 Avenue de l\'Indépendance, Antananarivo',
      email: 'client@sarl.mg',
      telephone: '+261 34 12 345 67'
    },
    {
      id_tiers: 2,
      nom: 'Fournisseur Import',
      type_tiers: 'fournisseur',
      numero: 'FRN001',
      adresse: '456 Rue du Commerce, Tamatave',
      email: 'contact@import.mg',
      telephone: '+261 33 12 345 68'
    },
    {
      id_tiers: 3,
      nom: 'Entreprise Service',
      type_tiers: 'client',
      numero: 'CLI002',
      adresse: '789 Boulevard de France, Antsirabe',
      email: 'info@service.mg',
      telephone: '+261 32 12 345 69'
    }
  ]);

  console.log('✅ Tiers insérés avec succès');
}

export async function unseed(knex) {
  await db('tiers').truncate();
}