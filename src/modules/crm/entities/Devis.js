export class Devis {
  constructor(data) {
    this.id_devis = data.id_devis;
    this.numero_devis = data.numero_devis;
    this.tiers_id = data.tiers_id;
    this.date_devis = data.date_devis;
    this.date_validite = data.date_validite;
    this.statut = data.statut || 'brouillon';
    this.montant_ht = data.montant_ht || 0;
    this.montant_ttc = data.montant_ttc || 0;
    this.objet = data.objet;
    this.conditions = data.conditions;
    this.notes = data.notes;
    
    // Relations
    this.client = data.client || null;
    this.lignes = data.lignes || [];
    
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
