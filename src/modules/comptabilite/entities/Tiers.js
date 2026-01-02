// src/modules/comptabilite/entities/Tiers.js (mis à jour)
export class Tiers {
  constructor(data) {
    this.id_tiers = data.id_tiers;
    this.code_tiers = data.code_tiers;
    this.nom = data.nom;
    this.type = data.type; // 'client', 'fournisseur'
    this.adresse = data.adresse;
    this.telephone = data.telephone;
    this.email = data.email;
    this.devise_preferee = data.devise_preferee || 'MGA';
    this.actif = data.actif !== undefined ? data.actif : true;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}