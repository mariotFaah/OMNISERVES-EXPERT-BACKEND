export function up(knex) {
  return knex.schema
    .createTable('plan_comptable', (table) => {
      table.string('numero_compte', 6).primary();
      table.string('libelle', 100).notNullable();
      table.enum('type_compte', ['actif', 'passif', 'charge', 'produit']).notNullable();
      table.string('categorie', 50);
      table.boolean('actif').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('referentiel_types_facture', (table) => {
      table.string('code', 20).primary();
      table.string('libelle', 50).notNullable();
      table.boolean('actif').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('referentiel_modes_paiement', (table) => {
      table.string('code', 20).primary();
      table.string('libelle', 50).notNullable();
      table.boolean('actif').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('referentiel_taux_tva', (table) => {
      table.decimal('taux', 5, 2).primary();
      table.string('libelle', 50).notNullable();
      table.boolean('actif').defaultTo(true);
      table.timestamps(true, true);
    });
}

export function down(knex) {
  return knex.schema
    .dropTable('referentiel_taux_tva')
    .dropTable('referentiel_modes_paiement')
    .dropTable('referentiel_types_facture')
    .dropTable('plan_comptable');
}