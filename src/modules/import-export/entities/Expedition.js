class Expedition {
  constructor(data = {}) {
    this.id = data.id;
    this.commande_id = data.commande_id;
    this.numero_bl = data.numero_bl;
    this.numero_connaissement = data.numero_connaissement;
    this.numero_packing_list = data.numero_packing_list;
    this.date_expedition = data.date_expedition;
    this.date_arrivee_prevue = data.date_arrivee_prevue;
    this.date_arrivee_reelle = data.date_arrivee_reelle;
    
    // Ancien champ (texte libre) - à migrer
    this.transporteur = data.transporteur;
    
    // Nouveaux champs
    this.transporteur_id = data.transporteur_id;
    this.mode_transport = data.mode_transport;
    this.instructions_speciales = data.instructions_speciales;
    this.statut = data.statut || 'preparation';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // Relations
    this.transporteur_detail = data.transporteur_detail;
    this.connaissement = data.connaissement;
  }
}

export default Expedition;