// src/modules/comptabilite/entities/Tiers.js
export class Tiers {
  constructor(data) {
    this.id_tiers = data.id_tiers;
    this.type_tiers = data.type_tiers || data.type; // Supporte les deux formats
    this.nom = data.nom;
    this.numero = data.numero;
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
    this.adresse = data.adresse;
    this.email = data.email;
    this.telephone = data.telephone;
    this.devise_preferee = data.devise_preferee || 'MGA';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
  
  // Méthode pour convertir vers la base de données
  toDatabase() {
    return {
      type_tiers: this.type_tiers,
      nom: this.nom,
      numero: this.numero,
      siret: this.siret,
      forme_juridique: this.forme_juridique,
      secteur_activite: this.secteur_activite,
      categorie: this.categorie,
      chiffre_affaires_annuel: this.chiffre_affaires_annuel,
      effectif: this.effectif,
      notes: this.notes,
      site_web: this.site_web,
      responsable_commercial: this.responsable_commercial,
      date_premier_contact: this.date_premier_contact,
      date_derniere_activite: this.date_derniere_activite,
      adresse: this.adresse,
      email: this.email,
      telephone: this.telephone,
      devise_preferee: this.devise_preferee,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}