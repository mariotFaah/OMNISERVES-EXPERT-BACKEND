export class LigneFacture {
  constructor(data) {
    this.id_ligne = data.id_ligne;
    this.numero_facture = data.numero_facture;
    this.code_article = data.code_article;
    this.description = data.description;
    this.quantite = data.quantite;
    this.prix_unitaire = data.prix_unitaire;
    this.taux_tva = data.taux_tva;
    this.remise = data.remise || 0;
    this.montant_ht = data.montant_ht;
    this.montant_tva = data.montant_tva;
    this.montant_ttc = data.montant_ttc;
  }
}