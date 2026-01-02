// src/modules/comptabilite/entities/TauxChange.js
export class TauxChange {
  constructor(data) {
    this.id_taux = data.id_taux;
    this.devise_source = data.devise_source;
    this.devise_cible = data.devise_cible;
    this.taux = data.taux;
    this.date_effet = data.date_effet || new Date();
    this.actif = data.actif !== undefined ? data.actif : true;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}