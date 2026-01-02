export class Activite {
  constructor(data) {
    this.id_activite = data.id_activite;
    this.tiers_id = data.tiers_id;
    this.type_activite = data.type_activite;
    this.sujet = data.sujet;
    this.description = data.description;
    this.date_activite = data.date_activite;
    this.date_rappel = data.date_rappel;
    this.statut = data.statut || 'planifie';
    this.priorite = data.priorite || 'normal';
    this.utilisateur_id = data.utilisateur_id;
    
    // Relations
    this.client = data.client || null;
    
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
