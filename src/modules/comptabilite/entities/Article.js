// src/modules/comptabilite/entities/Article.js 
export class Article {
  constructor(data) {
    this.code_article = data.code_article;
    this.description = data.description;
    this.prix_unitaire = data.prix_unitaire;
    this.taux_tva = data.taux_tva || 20;
    this.unite = data.unite || 'unite';
    this.devise = data.devise || 'MGA';
    
    // GESTION STOCK INTÉGRÉE
    this.quantite_stock = data.quantite_stock || 0;
    this.seuil_alerte = data.seuil_alerte || 5;
    
    this.actif = data.actif !== undefined ? data.actif : true;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // Statut calculé automatiquement
    this.statut_stock = this.calculerStatutStock();
  }

  calculerStatutStock() {
    if (this.quantite_stock <= 0) return 'rupture';
    if (this.quantite_stock <= this.seuil_alerte) return 'stock_faible';
    return 'disponible';
  }

  estDisponible(quantiteDemandee = 1) {
    return this.quantite_stock >= quantiteDemandee;
  }
}