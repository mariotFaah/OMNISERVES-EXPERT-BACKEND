export class Connaissement {
  constructor(data = {}) {
    this.id = data.id;
    this.numero_connaissement = data.numero_connaissement;
    this.expedition_id = data.expedition_id;
    this.transporteur_id = data.transporteur_id;
    this.type_connaissement = data.type_connaissement;
    this.type_document = data.type_document;
    this.date_emission = data.date_emission;
    this.date_embarquement = data.date_embarquement;
    this.port_chargement = data.port_chargement;
    this.port_dechargement = data.port_dechargement;
    this.consignataire = data.consignataire;
    this.destinataire = data.destinataire;
    this.statut = data.statut || 'emis';
    this.fichier_url = data.fichier_url;
    this.observations = data.observations;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // Relations
    this.expedition = data.expedition;
    this.transporteur = data.transporteur;
  }
}

export default Connaissement;