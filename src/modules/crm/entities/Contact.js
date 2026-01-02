export class Contact {
  constructor(data) {
    this.id_contact = data.id_contact;
    this.tiers_id = data.tiers_id;
    this.nom = data.nom;
    this.prenom = data.prenom;
    this.fonction = data.fonction;
    this.email = data.email;
    this.telephone = data.telephone;
    this.principal = data.principal || false;
    this.notes = data.notes;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
