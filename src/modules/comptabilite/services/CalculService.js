export class CalculService {
  
  // Calculer le montant HT d'une ligne
  calculerMontantHT(prix_unitaire, quantite, remise = 0) {
    const montantBrut = prix_unitaire * quantite;
    const montantRemise = montantBrut * (remise / 100);
    return montantBrut - montantRemise;
  }

  // Calculer le montant TVA d'une ligne
  calculerMontantTVA(montantHT, taux_tva) {
    return montantHT * (taux_tva / 100);
  }

  // Calculer le montant TTC d'une ligne
  calculerMontantTTC(montantHT, montantTVA) {
    return montantHT + montantTVA;
  }

  // Calculer tous les montants d'une ligne de facture
  calculerLigneFacture(ligne) {
    const { prix_unitaire, quantite, remise = 0, taux_tva } = ligne;
    
    const montant_ht = this.calculerMontantHT(prix_unitaire, quantite, remise);
    const montant_tva = this.calculerMontantTVA(montant_ht, taux_tva);
    const montant_ttc = this.calculerMontantTTC(montant_ht, montant_tva);
    
    return {
      montant_ht: Math.round(montant_ht * 100) / 100,
      montant_tva: Math.round(montant_tva * 100) / 100,
      montant_ttc: Math.round(montant_ttc * 100) / 100
    };
  }

  // Calculer les totaux d'une facture à partir des lignes
  calculerTotauxFacture(lignes) {
    const totaux = lignes.reduce((acc, ligne) => {
      return {
        total_ht: acc.total_ht + ligne.montant_ht,
        total_tva: acc.total_tva + ligne.montant_tva,
        total_ttc: acc.total_ttc + ligne.montant_ttc
      };
    }, { total_ht: 0, total_tva: 0, total_ttc: 0 });

    return {
      total_ht: Math.round(totaux.total_ht * 100) / 100,
      total_tva: Math.round(totaux.total_tva * 100) / 100,
      total_ttc: Math.round(totaux.total_ttc * 100) / 100
    };
  }
}

export default CalculService;