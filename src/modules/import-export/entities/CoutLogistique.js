class CoutLogistique {
  constructor(data = {}) {
    this.id = data.id;
    this.commande_id = data.commande_id;
    this.fret_maritime = data.fret_maritime || 0;
    this.fret_aerien = data.fret_aerien || 0;
    this.assurance = data.assurance || 0;
    this.droits_douane = data.droits_douane || 0;
    this.frais_transit = data.frais_transit || 0;
    this.transport_local = data.transport_local || 0;
    this.autres_frais = data.autres_frais || 0;
    this.description_autres_frais = data.description_autres_frais;
    this.devise_couts = data.devise_couts || 'EUR';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
  
  get total_couts() {
    return this.fret_maritime + this.fret_aerien + this.assurance + 
           this.droits_douane + this.frais_transit + this.transport_local + 
           this.autres_frais;
  }
}

export default CoutLogistique;
