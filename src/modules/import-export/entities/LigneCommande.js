class LigneCommande {
  constructor(data = {}) {
    this.id = data.id;
    this.commande_id = data.commande_id;
    this.article_id = data.article_id;
    this.description = data.description;
    this.quantite = data.quantite;
    this.prix_unitaire = data.prix_unitaire;
    this.taux_tva = data.taux_tva || 0;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // Relations
    this.article = data.article;
  }
  
  get montant_ht() {
    return this.quantite * this.prix_unitaire;
  }
  
  get montant_tva() {
    return this.montant_ht * (this.taux_tva / 100);
  }
  
  get montant_ttc() {
    return this.montant_ht + this.montant_tva;
  }
}

export default LigneCommande;
