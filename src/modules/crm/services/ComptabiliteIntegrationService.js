import connection from '../../../core/database/connection.js';

export class ComptabiliteIntegrationService {
  constructor() {
    this.db = connection;
  }

  /**
   * Récupérer les factures impayées d'un client
   */
  async getFacturesImpayeesByClient(tiers_id) {
    try {
      const factures = await this.db('factures')
        .select('*')
        .where('id_tiers', tiers_id)
        .where('statut_paiement', '!=', 'payee')
        .where('statut', 'validee')
        .orderBy('date', 'desc');

      return factures.map(facture => ({
        ...facture,
        type: 'comptabilite',
        source: 'facture',
        date_activite: facture.date,
        sujet: `Facture ${facture.numero_facture} - ${facture.statut_paiement}`,
        montant_restant: facture.montant_restant || 0
      }));
    } catch (error) {
      console.error('Erreur ComptabiliteIntegrationService.getFacturesImpayeesByClient:', error);
      return [];
    }
  }

  /**
   * Récupérer l'historique des paiements d'un client
   */
  async getPaiementsByClient(tiers_id) {
    try {
      const paiements = await this.db('paiements as p')
        .select('p.*', 'f.numero_facture', 'f.date as date_facture')
        .leftJoin('factures as f', 'p.numero_facture', 'f.numero_facture')
        .where('f.id_tiers', tiers_id)
        .orderBy('p.date_paiement', 'desc');

      return paiements.map(paiement => ({
        ...paiement,
        type: 'comptabilite',
        source: 'paiement',
        date_activite: paiement.date_paiement,
        sujet: `Paiement ${paiement.montant} MGA - Facture ${paiement.numero_facture}`
      }));
    } catch (error) {
      console.error('Erreur ComptabiliteIntegrationService.getPaiementsByClient:', error);
      return [];
    }
  }

  /**
   * Générer les relances de paiement automatiques
   */
  async genererRelancesPaiementsAutomatiques() {
    try {
      const facturesImpayees = await this.db('factures as f')
        .select('f.*', 't.nom as client_nom')
        .leftJoin('tiers as t', 'f.id_tiers', 't.id_tiers')
        .where('f.statut_paiement', '!=', 'payee')
        .where('f.statut', 'validee')
        .where(function() {
          this.where('f.date_finale_paiement', '<', new Date())
            .orWhere('f.statut_paiement', 'en_retard')
        });

      const relances = [];
      
      for (const facture of facturesImpayees) {
        relances.push({
          type_relance: 'paiement',
          tiers_id: facture.id_tiers,
          facture_id: facture.numero_facture,
          objet: `Relance paiement - Facture ${facture.numero_facture}`,
          message: `Cher client, votre facture ${facture.numero_facture} d'un montant de ${facture.montant_restant || facture.total_ttc} MGA est en retard de paiement.`,
          date_relance: new Date(),
          echeance: facture.date_finale_paiement,
          statut: 'en_attente',
          canal: 'email'
        });
      }

      return relances;
    } catch (error) {
      console.error('Erreur ComptabiliteIntegrationService.genererRelancesPaiementsAutomatiques:', error);
      return [];
    }
  }

  /**
   * Récupérer le chiffre d'affaires par client
   */
  async getChiffreAffairesByClient(tiers_id) {
    try {
      const result = await this.db('factures')
        .where('id_tiers', tiers_id)
        .where('statut', 'validee')
        .where('type_facture', 'vente')
        .sum('total_ttc as chiffre_affaires')
        .first();

      return result.chiffre_affaires || 0;
    } catch (error) {
      console.error('Erreur ComptabiliteIntegrationService.getChiffreAffairesByClient:', error);
      return 0;
    }
  }
}

export default ComptabiliteIntegrationService;
