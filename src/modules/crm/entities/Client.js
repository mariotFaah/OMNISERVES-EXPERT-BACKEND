export class Client {
  constructor(data) {
    // Données de base de la table tiers
    this.id_tiers = data.id_tiers;
    this.nom = data.nom;
    this.type_tiers = data.type_tiers;
    this.numero = data.numero;
    this.adresse = data.adresse;
    this.email = data.email;
    this.telephone = data.telephone;
    
    // Données CRM étendues
    this.siret = data.siret;
    this.forme_juridique = data.forme_juridique;
    this.secteur_activite = data.secteur_activite;
    this.categorie = data.categorie;
    this.chiffre_affaires_annuel = data.chiffre_affaires_annuel;
    this.effectif = data.effectif;
    this.notes = data.notes;
    this.site_web = data.site_web;
    this.responsable_commercial = data.responsable_commercial;
    this.date_premier_contact = data.date_premier_contact;
    this.date_derniere_activite = data.date_derniere_activite;
    
    // Relations (seront peuplées par les services)
    this.contacts = data.contacts || [];
    this.devis = data.devis || [];
    this.contrats = data.contrats || [];
    this.activites = data.activites || [];
    this.relances = data.relances || [];
    
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
