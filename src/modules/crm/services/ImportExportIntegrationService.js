import connection from '../../../core/database/connection.js';

export class ImportExportIntegrationService {
  constructor() {
    this.db = connection;
  }

  /**
   * Récupérer les commandes d'un client
   */
  async getCommandesByClient(tiers_id) {
    try {
      const commandes = await this.db('commandes as c')
        .select(
          'c.*',
          't.nom as client_nom',
          'f.nom as fournisseur_nom'
        )
        .leftJoin('tiers as t', 'c.client_id', 't.id_tiers')
        .leftJoin('tiers as f', 'c.fournisseur_id', 'f.id_tiers')
        .where('c.client_id', tiers_id)
        .orWhere('c.fournisseur_id', tiers_id)
        .orderBy('c.date_commande', 'desc');

      return commandes.map(commande => ({
        ...commande,
        type: 'import_export',
        source: 'commande',
        date_activite: commande.date_commande,
        sujet: `Commande ${commande.numero_commande} - ${commande.type}`,
        statut: commande.statut
      }));
    } catch (error) {
      console.error('Erreur ImportExportIntegrationService.getCommandesByClient:', error);
      return [];
    }
  }

  /**
   * Récupérer les expéditions d'un client
   */
  async getExpeditionsByClient(tiers_id) {
    try {
      const expeditions = await this.db('expeditions as e')
        .select('e.*', 'c.numero_commande', 'c.type as type_commande')
        .leftJoin('commandes as c', 'e.commande_id', 'c.id')
        .where('c.client_id', tiers_id)
        .orWhere('c.fournisseur_id', tiers_id)
        .orderBy('e.date_expedition', 'desc');

      return expeditions.map(expedition => ({
        ...expedition,
        type: 'import_export',
        source: 'expedition',
        date_activite: expedition.date_expedition,
        sujet: `Expédition ${expedition.numero_bl || 'N/A'} - ${expedition.statut}`,
        statut: expedition.statut
      }));
    } catch (error) {
      console.error('Erreur ImportExportIntegrationService.getExpeditionsByClient:', error);
      return [];
    }
  }

  /**
   * Récupérer les statistiques import/export par client
   */
  async getStatsImportExportByClient(tiers_id) {
    try {
      const commandes = await this.getCommandesByClient(tiers_id);
      
      const stats = {
        total_commandes: commandes.length,
        commandes_import: commandes.filter(c => c.type === 'import').length,
        commandes_export: commandes.filter(c => c.type === 'export').length,
        commandes_en_cours: commandes.filter(c => 
          ['brouillon', 'confirmée', 'expédiée'].includes(c.statut)
        ).length,
        commandes_terminees: commandes.filter(c => c.statut === 'livrée').length,
        chiffre_affaires_import_export: commandes
          .filter(c => c.statut === 'livrée')
          .reduce((total, c) => total + parseFloat(c.montant_total || 0), 0)
      };

      return stats;
    } catch (error) {
      console.error('Erreur ImportExportIntegrationService.getStatsImportExportByClient:', error);
      return {};
    }
  }
}

export default ImportExportIntegrationService;
