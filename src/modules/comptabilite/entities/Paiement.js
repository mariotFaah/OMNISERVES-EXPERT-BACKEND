// src/modules/comptabilite/entities/Paiement.js
export class Paiement {
  constructor(data) {
    this.id_paiement = data.id_paiement;
    this.numero_facture = data.numero_facture;
    this.date_paiement = data.date_paiement || new Date();
    this.montant = data.montant;
    this.mode_paiement = data.mode_paiement; // 'espèce', 'virement', 'chèque', 'carte'
    this.reference = data.reference;
    this.statut = data.statut || 'validé';
    this.devise = data.devise || 'MGA';
    this.taux_change = data.taux_change || 1;
    this.notes = data.notes;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}