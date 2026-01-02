export function up(knex) {
  return knex.schema.alterTable('expeditions', function(table) {
    // Ajouter transporteur_id
    table.integer('transporteur_id').unsigned().after('transporteur');
    
    // Ajouter la clé étrangère
    table.foreign('transporteur_id').references('id').inTable('transporteurs');
    
    // Index
    table.index(['transporteur_id'], 'idx_expedition_transporteur');
  });
}

export function down(knex) {
  return knex.schema.alterTable('expeditions', function(table) {
    table.dropForeign('transporteur_id');
    table.dropIndex('idx_expedition_transporteur');
    table.dropColumn('transporteur_id');
  });
}