// src/modules/comptabilite/entities/Facture.js
export class Facture {
  constructor(data) {
    this.numero_facture = data.numero_facture; 
    this.date = data.date || new Date();
    this.type_facture = data.type_facture;
    this.id_tiers = data.id_tiers;
    this.echeance = data.echeance;
    this.reglement = data.reglement;
    this.total_ht = data.total_ht || 0;
    this.total_tva = data.total_tva || 0;
    this.total_ttc = data.total_ttc || 0;
    this.statut = data.statut || 'brouillon';
    this.devise = data.devise || 'MGA';
    this.taux_change = data.taux_change || 1;
    this.notes = data.notes;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // NOUVEAUX CHAMPS PAIEMENT FLEXIBLE
    this.statut_paiement = data.statut_paiement || 'non_paye';
    this.type_paiement = data.type_paiement || 'comptant';
    this.montant_paye = data.montant_paye || 0;
    this.montant_restant = data.montant_restant || (this.total_ttc - (data.montant_paye || 0));
    this.date_finale_paiement = data.date_finale_paiement;
    this.montant_minimum_paiement = data.montant_minimum_paiement || 0;
    this.penalite_retard = data.penalite_retard || 0;
  }

  // Méthode pour calculer automatiquement le montant restant
  calculerMontantRestant() {
    this.montant_restant = this.total_ttc - this.montant_paye;
    return this.montant_restant;
  }

  // Méthode pour mettre à jour le statut de paiement
  mettreAJourStatutPaiement() {
    if (this.montant_restant <= 0) {
      this.statut_paiement = 'payee';
    } else if (this.date_finale_paiement && new Date() > new Date(this.date_finale_paiement)) {
      this.statut_paiement = 'en_retard';
    } else if (this.montant_paye > 0) {
      this.statut_paiement = 'partiellement_payee';
    } else {
      this.statut_paiement = 'non_paye';
    }
  }
}