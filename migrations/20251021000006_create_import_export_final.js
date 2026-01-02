/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function(knex) {
  // Table des commandes (sans contraintes étrangères d'abord)
  await knex.schema.createTable('commandes', (table) => {
    table.increments('id');
    table.string('numero_commande').unique().notNullable();
    table.enu('type', ['import', 'export']).notNullable();
    table.integer('client_id').unsigned().notNullable();
    table.integer('fournisseur_id').unsigned().notNullable();
    table.date('date_commande').notNullable();
    table.date('date_livraison_prevue');
    table.enu('statut', ['brouillon', 'confirmée', 'expédiée', 'livrée', 'annulée']).defaultTo('brouillon');
    table.text('notes');
    table.decimal('montant_total', 15, 2).defaultTo(0);
    table.string('devise', 3).defaultTo('EUR');
    table.timestamps(true, true);
  });

  // Table des lignes de commande
  await knex.schema.createTable('lignes_commande', (table) => {
    table.increments('id');
    table.integer('commande_id').unsigned().notNullable();
    table.integer('article_id').unsigned();
    table.string('description').notNullable();
    table.decimal('quantite', 10, 2).notNullable();
    table.decimal('prix_unitaire', 15, 2).notNullable();
    table.decimal('taux_tva', 5, 2).defaultTo(0);
    table.timestamps(true, true);
  });

  // Table des expéditions
  await knex.schema.createTable('expeditions', (table) => {
    table.increments('id');
    table.integer('commande_id').unsigned().notNullable();
    table.string('numero_bl');
    table.string('numero_connaissement');
    table.string('numero_packing_list');
    table.date('date_expedition');
    table.date('date_arrivee_prevue');
    table.date('date_arrivee_reelle');
    table.string('transporteur');
    table.string('mode_transport', 50);
    table.text('instructions_speciales');
    table.enu('statut', ['preparation', 'expédiée', 'transit', 'arrivée', 'livrée']).defaultTo('preparation');
    table.timestamps(true, true);
  });

  // Table des coûts logistiques
  await knex.schema.createTable('couts_logistiques', (table) => {
    table.increments('id');
    table.integer('commande_id').unsigned().notNullable();
    table.decimal('fret_maritime', 15, 2).defaultTo(0);
    table.decimal('fret_aerien', 15, 2).defaultTo(0);
    table.decimal('assurance', 15, 2).defaultTo(0);
    table.decimal('droits_douane', 15, 2).defaultTo(0);
    table.decimal('frais_transit', 15, 2).defaultTo(0);
    table.decimal('transport_local', 15, 2).defaultTo(0);
    table.decimal('autres_frais', 15, 2).defaultTo(0);
    table.text('description_autres_frais');
    table.string('devise_couts', 3).defaultTo('EUR');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function(knex) {
  await knex.schema.dropTableIfExists('couts_logistiques');
  await knex.schema.dropTableIfExists('expeditions');
  await knex.schema.dropTableIfExists('lignes_commande');
  await knex.schema.dropTableIfExists('commandes');
};
