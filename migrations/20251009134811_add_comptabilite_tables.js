// migrations/20251009134811_add_comptabilite_tables.js
export function up(knex) {
  return knex.schema
    .createTable('paiements', (table) => {
      table.increments('id_paiement').primary();
      table.integer('numero_facture').unsigned().notNullable(); 
      table.date('date_paiement').notNullable();
      table.decimal('montant', 15, 2).notNullable();
      table.enu('mode_paiement', ['espèce', 'virement', 'chèque', 'carte']).notNullable();
      table.string('reference');
      table.enu('statut', ['validé', 'en_attente', 'annulé']).defaultTo('validé');
      table.string('devise', 3).defaultTo('MGA');
      table.decimal('taux_change', 10, 4).defaultTo(1);
      table.text('notes');
      table.timestamps(true, true);
      
      // Clé étrangère avec le bon type
      table.foreign('numero_facture').references('numero_facture').inTable('factures');
    })
    .createTable('taux_change', (table) => {
      table.increments('id_taux').primary();
      table.string('devise_source', 3).notNullable();
      table.string('devise_cible', 3).notNullable();
      table.decimal('taux', 10, 4).notNullable();
      table.date('date_effet').notNullable();
      table.boolean('actif').defaultTo(true);
      table.timestamps(true, true);
      
      table.unique(['devise_source', 'devise_cible', 'date_effet']);
    })
    .createTable('ecritures_comptables', (table) => {
      table.increments('id_ecriture').primary();
      table.string('numero_ecriture', 50).notNullable().unique();
      table.date('date').notNullable();
      table.enu('journal', ['ventes', 'achats', 'banque', 'caisse']).notNullable();
      table.string('compte', 10).notNullable();
      table.string('libelle').notNullable();
      table.decimal('debit', 15, 2).defaultTo(0);
      table.decimal('credit', 15, 2).defaultTo(0);
      table.string('devise', 3).defaultTo('MGA');
      table.decimal('taux_change', 10, 4).defaultTo(1);
      table.string('reference');
      table.text('notes');
      table.timestamps(true, true);
    })
    // Ajouter les colonnes manquantes aux tables existantes
    .table('tiers', (table) => {
      table.string('devise_preferee', 3).defaultTo('MGA');
    })
    .table('articles', (table) => {
      table.string('devise', 3).defaultTo('MGA');
    })
    .table('factures', (table) => {
      table.string('devise', 3).defaultTo('MGA');
      table.decimal('taux_change', 10, 4).defaultTo(1);
      table.text('notes');
    });
}

export function down(knex) {
  return knex.schema
    .dropTable('ecritures_comptables')
    .dropTable('taux_change')
    .dropTable('paiements')
    .table('tiers', (table) => {
      table.dropColumn('devise_preferee');
    })
    .table('articles', (table) => {
      table.dropColumn('devise');
    })
    .table('factures', (table) => {
      table.dropColumn('devise');
      table.dropColumn('taux_change');
      table.dropColumn('notes');
    });
}