// migrations/20251105000000_add_stock_columns_to_articles.js
export function up(knex) {
  return knex.schema.alterTable('articles', (table) => {
    table.integer('quantite_stock').defaultTo(0).notNullable();
    table.integer('seuil_alerte').defaultTo(5).notNullable();
  });
}

export function down(knex) {
  return knex.schema.alterTable('articles', (table) => {
    table.dropColumn('quantite_stock');
    table.dropColumn('seuil_alerte');
  });
}