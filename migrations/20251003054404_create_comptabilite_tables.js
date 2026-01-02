export function up(knex) {
  return knex.schema
    .createTable('tiers', (table) => {
      table.increments('id_tiers').primary();
      table.enum('type_tiers', ['client', 'fournisseur']).notNullable();
      table.string('nom', 255).notNullable();
      table.string('numero', 50).unique();
      table.text('adresse');
      table.string('email', 255);
      table.string('telephone', 20);
      table.timestamps(true, true);
    })
    .createTable('articles', (table) => {
      table.string('code_article', 50).primary();
      table.string('description', 255).notNullable();
      table.decimal('prix_unitaire', 15, 2).notNullable();
      table.decimal('taux_tva', 5, 2).defaultTo(20);
      table.string('unite', 20).defaultTo('unite');
      table.boolean('actif').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('factures', (table) => {
      table.increments('numero_facture').primary();
      table.date('date').notNullable();
      table.enum('type_facture', ['proforma', 'facture', 'avoir']).notNullable();
      table.integer('id_tiers').unsigned().notNullable();
      table.date('echeance');
      table.string('reglement', 50);
      table.decimal('total_ht', 15, 2).defaultTo(0);
      table.decimal('total_tva', 15, 2).defaultTo(0);
      table.decimal('total_ttc', 15, 2).defaultTo(0);
      table.enum('statut', ['brouillon', 'validee', 'annulee']).defaultTo('brouillon');
      table.timestamps(true, true);
      
      table.foreign('id_tiers').references('id_tiers').inTable('tiers');
    })
    .createTable('ligne_facture', (table) => {
      table.increments('id_ligne').primary();
      table.integer('numero_facture').unsigned().notNullable();
      table.string('code_article', 50).notNullable();
      table.string('description', 255);
      table.decimal('quantite', 10, 2).notNullable();
      table.decimal('prix_unitaire', 15, 2).notNullable();
      table.decimal('taux_tva', 5, 2).notNullable();
      table.decimal('remise', 5, 2).defaultTo(0);
      table.decimal('montant_ht', 15, 2).notNullable();
      table.decimal('montant_tva', 15, 2).notNullable();
      table.decimal('montant_ttc', 15, 2).notNullable();
      
      table.foreign('numero_facture').references('numero_facture').inTable('factures');
      table.foreign('code_article').references('code_article').inTable('articles');
    });
}

export function down(knex) {
  return knex.schema
    .dropTable('ligne_facture')
    .dropTable('factures')
    .dropTable('articles')
    .dropTable('tiers');
}