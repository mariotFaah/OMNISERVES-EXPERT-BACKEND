export function up(knex) {
  return knex.schema
    // Table des contacts multiples par client
    .createTable('contacts', (table) => {
      table.increments('id_contact').primary();
      table.integer('tiers_id').unsigned().notNullable();
      table.string('nom', 255).notNullable();
      table.string('prenom', 255);
      table.string('fonction', 100);
      table.string('email', 255);
      table.string('telephone', 20);
      table.boolean('principal').defaultTo(false);
      table.text('notes');
      table.timestamps(true, true);
      
      table.foreign('tiers_id').references('id_tiers').inTable('tiers').onDelete('CASCADE');
    })
    
    // Table des devis
    .createTable('devis', (table) => {
      table.increments('id_devis').primary();
      table.string('numero_devis', 50).unique().notNullable();
      table.integer('tiers_id').unsigned().notNullable();
      table.date('date_devis').notNullable();
      table.date('date_validite');
      table.enum('statut', ['brouillon', 'envoye', 'accepte', 'refuse', 'expire']).defaultTo('brouillon');
      table.decimal('montant_ht', 15, 2).defaultTo(0);
      table.decimal('montant_ttc', 15, 2).defaultTo(0);
      table.text('objet');
      table.text('conditions');
      table.text('notes');
      table.timestamps(true, true);
      
      table.foreign('tiers_id').references('id_tiers').inTable('tiers');
    })
    
    // Table des contrats de prestation
    .createTable('contrats', (table) => {
      table.increments('id_contrat').primary();
      table.string('numero_contrat', 50).unique().notNullable();
      table.integer('tiers_id').unsigned().notNullable();
      table.integer('devis_id').unsigned();
      table.string('type_contrat', 100).notNullable(); // maintenance, consulting, formation, etc.
      table.date('date_debut').notNullable();
      table.date('date_fin');
      table.enum('statut', ['actif', 'inactif', 'resilie', 'termine']).defaultTo('actif');
      table.decimal('montant_ht', 15, 2).defaultTo(0);
      table.string('periodicite', 50); // mensuel, trimestriel, annuel, unique
      table.text('description');
      table.text('conditions');
      table.timestamps(true, true);
      
      table.foreign('tiers_id').references('id_tiers').inTable('tiers');
      table.foreign('devis_id').references('id_devis').inTable('devis');
    })
    
    // Table des activités (interactions avec les clients)
    .createTable('activites', (table) => {
      table.increments('id_activite').primary();
      table.integer('tiers_id').unsigned().notNullable();
      table.string('type_activite', 50).notNullable(); // appel, email, reunion, visite
      table.string('sujet', 255).notNullable();
      table.text('description');
      table.dateTime('date_activite').notNullable();
      table.dateTime('date_rappel');
      table.enum('statut', ['planifie', 'realise', 'annule']).defaultTo('planifie');
      table.string('priorite', 20).defaultTo('normal'); // bas, normal, haut, urgent
      table.integer('utilisateur_id').unsigned();
      table.timestamps(true, true);
      
      table.foreign('tiers_id').references('id_tiers').inTable('tiers').onDelete('CASCADE');
    })
    
    // Table des relances
    .createTable('relances', (table) => {
      table.increments('id_relance').primary();
      table.integer('tiers_id').unsigned().notNullable();
      table.string('type_relance', 50).notNullable(); // paiement, contrat, echeance, commerciale
      table.string('objet', 255).notNullable();
      table.text('message');
      table.date('date_relance').notNullable();
      table.date('echeance');
      table.enum('statut', ['en_attente', 'envoyee', 'traitee', 'annulee']).defaultTo('en_attente');
      table.enum('canal', ['email', 'telephone', 'courrier', 'sms']).defaultTo('email');
      table.integer('facture_id').unsigned();
      table.integer('contrat_id').unsigned();
      table.timestamps(true, true);
      
      table.foreign('tiers_id').references('id_tiers').inTable('tiers').onDelete('CASCADE');
      table.foreign('facture_id').references('numero_facture').inTable('factures');
      table.foreign('contrat_id').references('id_contrat').inTable('contrats');
    })
    
    // Ajouter des colonnes CRM à la table tiers existante
    .table('tiers', (table) => {
      table.string('siret', 14).after('numero');
      table.string('forme_juridique', 100).after('siret');
      table.string('secteur_activite', 100).after('forme_juridique');
      table.enum('categorie', ['prospect', 'client', 'fournisseur', 'partenaire']).after('secteur_activite');
      table.integer('chiffre_affaires_annuel').after('categorie');
      table.integer('effectif').after('chiffre_affaires_annuel');
      table.text('notes').after('effectif');
      table.string('site_web', 255).after('notes');
      table.string('responsable_commercial', 255).after('site_web');
      table.date('date_premier_contact').after('responsable_commercial');
      table.date('date_derniere_activite').after('date_premier_contact');
    });
}

export function down(knex) {
  return knex.schema
    .dropTable('relances')
    .dropTable('activites')
    .dropTable('contrats')
    .dropTable('devis')
    .dropTable('contacts')
    .table('tiers', (table) => {
      table.dropColumn('siret');
      table.dropColumn('forme_juridique');
      table.dropColumn('secteur_activite');
      table.dropColumn('categorie');
      table.dropColumn('chiffre_affaires_annuel');
      table.dropColumn('effectif');
      table.dropColumn('notes');
      table.dropColumn('site_web');
      table.dropColumn('responsable_commercial');
      table.dropColumn('date_premier_contact');
      table.dropColumn('date_derniere_activite');
    });
}
