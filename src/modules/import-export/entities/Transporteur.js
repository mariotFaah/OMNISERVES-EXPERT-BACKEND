export class Transporteur {
  constructor(data = {}) {
    this.id = data.id;
    this.nom = data.nom;
    this.type_transport = data.type_transport;
    this.contact = data.contact;
    this.email = data.email;
    this.telephone = data.telephone;
    this.adresse = data.adresse;
    this.code_transporteur = data.code_transporteur;
    this.actif = data.actif !== undefined ? data.actif : true;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

export default Transporteur;