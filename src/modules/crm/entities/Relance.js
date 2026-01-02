export class Relance {
  constructor(data) {
    this.id_relance = data.id_relance;
    this.tiers_id = data.tiers_id;
    this.type_relance = data.type_relance;
    this.objet = data.objet;
    this.message = data.message;
    this.date_relance = data.date_relance;
    this.echeance = data.echeance;
    this.statut = data.statut || 'en_attente';
    this.canal = data.canal || 'email';
    this.facture_id = data.facture_id;
    this.contrat_id = data.contrat_id;
    
    // Relations
    this.client = data.client || null;
    this.facture = data.facture || null;
    this.contrat = data.contrat || null;
    
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
