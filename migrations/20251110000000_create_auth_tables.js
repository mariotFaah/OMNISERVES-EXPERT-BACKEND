// backend/migrations/20251110000000_create_auth_tables.js
export function up(knex) {
  return knex.schema
    .createTable('roles', function(table) {
      table.increments('id_role').primary();
      table.string('code_role', 50).notNullable().unique();
      table.string('nom_role', 100).notNullable();
      table.text('description');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('users', function(table) {
      table.increments('id_user').primary();
      table.string('email', 255).notNullable().unique();
      table.string('password_hash', 255).notNullable();
      table.string('nom', 100).notNullable();
      table.string('prenom', 100).notNullable();
      table.integer('id_role').unsigned().notNullable();
      table.boolean('is_active').defaultTo(true);
      table.timestamp('last_login');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.foreign('id_role').references('id_role').inTable('roles');
    })
    .createTable('permissions', function(table) {
      table.increments('id_permission').primary();
      table.string('module', 50).notNullable();
      table.string('action', 50).notNullable();
      table.string('description', 255);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('role_permissions', function(table) {
      table.increments('id_role_permission').primary();
      table.integer('id_role').unsigned().notNullable();
      table.integer('id_permission').unsigned().notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      table.foreign('id_role').references('id_role').inTable('roles');
      table.foreign('id_permission').references('id_permission').inTable('permissions');
      table.unique(['id_role', 'id_permission']);
    });
}

export function down(knex) {
  return knex.schema
    .dropTableIfExists('role_permissions')
    .dropTableIfExists('permissions')
    .dropTableIfExists('users')
    .dropTableIfExists('roles');
}