class Commande {
  constructor(data = {}) {
    this.id = data.id;
    this.numero_commande = data.numero_commande;
    this.type = data.type; // 'import' ou 'export'
    this.client_id = data.client_id;
    this.fournisseur_id = data.fournisseur_id;
    this.date_commande = data.date_commande;
    this.date_livraison_prevue = data.date_livraison_prevue;
    this.statut = data.statut || 'brouillon';
    this.notes = data.notes;
    this.montant_total = data.montant_total || 0;
    this.devise = data.devise || 'EUR';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // Relations
    this.client = data.client;
    this.fournisseur = data.fournisseur;
    this.lignes = data.lignes || [];
    this.expedition = data.expedition;
    this.couts_logistiques = data.couts_logistiques;
  }
}

export default Commande;
