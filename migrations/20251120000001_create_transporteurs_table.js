export function up(knex) {
  return knex.schema.createTable('transporteurs', function(table) {
    table.increments('id').primary();
    table.string('nom', 255).notNullable();
    table.string('type_transport', 50); // maritime, aerien, terrestre, multimodal
    table.string('contact', 255);
    table.string('email', 255);
    table.string('telephone', 50);
    table.text('adresse');
    table.string('code_transporteur', 50).unique();
    table.boolean('actif').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index(['nom', 'type_transport']);
  });
}

export function down(knex) {
  return knex.schema.dropTable('transporteurs');
}