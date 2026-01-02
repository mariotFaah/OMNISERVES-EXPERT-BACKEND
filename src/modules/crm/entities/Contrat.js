export class Contrat {
  constructor(data) {
    this.id_contrat = data.id_contrat;
    this.numero_contrat = data.numero_contrat;
    this.tiers_id = data.tiers_id;
    this.devis_id = data.devis_id;
    this.type_contrat = data.type_contrat;
    this.date_debut = data.date_debut;
    this.date_fin = data.date_fin;
    this.statut = data.statut || 'actif';
    this.montant_ht = data.montant_ht || 0;
    this.periodicite = data.periodicite;
    this.description = data.description;
    this.conditions = data.conditions;
    
    // Relations
    this.client = data.client || null;
    this.devis = data.devis || null;
    
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
