// src/modules/comptabilite/entities/EcritureComptable.js
export class EcritureComptable {
  constructor(data) {
    this.id_ecriture = data.id_ecriture;
    this.numero_ecriture = data.numero_ecriture;
    this.date = data.date || new Date();
    this.journal = data.journal; // 'ventes', 'achats', 'banque', 'caisse'
    this.compte = data.compte;
    this.libelle = data.libelle;
    this.debit = data.debit || 0;
    this.credit = data.credit || 0;
    this.devise = data.devise || 'MGA';
    this.taux_change = data.taux_change || 1;
    this.reference = data.reference;
    this.notes = data.notes;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}