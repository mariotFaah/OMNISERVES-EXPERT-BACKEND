import { RelanceRepository } from '../repositories/RelanceRepository.js';
import { ComptabiliteIntegrationService } from './ComptabiliteIntegrationService.js';

export class RelanceService {
  constructor() {
    this.relanceRepository = new RelanceRepository();
    this.comptabiliteIntegration = new ComptabiliteIntegrationService();
  }

  async getAllRelances() {
    try {
      return await this.relanceRepository.findAllWithDetails();
    } catch (error) {
      console.error('Erreur RelanceService.getAllRelances:', error);
      throw new Error('Erreur lors de la récupération des relances');
    }
  }

  async getRelancesByClient(tiers_id) {
    try {
      return await this.relanceRepository.findByClient(tiers_id);
    } catch (error) {
      console.error('Erreur RelanceService.getRelancesByClient:', error);
      throw new Error('Erreur lors de la récupération des relances client');
    }
  }

  async getRelancesByStatut(statut) {
    try {
      return await this.relanceRepository.findByStatut(statut);
    } catch (error) {
      console.error('Erreur RelanceService.getRelancesByStatut:', error);
      throw new Error('Erreur lors de la récupération des relances par statut');
    }
  }

  async createRelance(relanceData) {
    try {
      return await this.relanceRepository.create(relanceData);
    } catch (error) {
      console.error('Erreur RelanceService.createRelance:', error);
      throw new Error('Erreur lors de la création de la relance');
    }
  }

  async updateRelanceStatut(id_relance, statut) {
    try {
      return await this.relanceRepository.updateStatut(id_relance, statut);
    } catch (error) {
      console.error('Erreur RelanceService.updateRelanceStatut:', error);
      throw new Error('Erreur lors de la mise à jour du statut');
    }
  }

  async genererRelancesAutomatiques() {
    try {
      // Générer les relances de paiement automatiques
      const relancesPaiements = await this.comptabiliteIntegration.genererRelancesPaiementsAutomatiques();
      
      let relancesCrees = 0;
      
      // Créer les relances dans la base de données
      for (const relanceData of relancesPaiements) {
        // Vérifier si une relance similaire existe déjà
        const relanceExistante = await this.relanceRepository.findByClient(relanceData.tiers_id)
          .then(relances => relances.find(r => 
            r.facture_id === relanceData.facture_id && 
            r.type_relance === 'paiement'
          ));
        
        if (!relanceExistante) {
          await this.relanceRepository.create(relanceData);
          relancesCrees++;
        }
      }

      return {
        message: 'Relances automatiques générées avec succès',
        relances_paiements: relancesPaiements.length,
        relances_contrats: 0, // À implémenter plus tard
        relances_creees: relancesCrees,
        total_relances: relancesPaiements.length
      };
    } catch (error) {
      console.error('Erreur RelanceService.genererRelancesAutomatiques:', error);
      throw new Error('Erreur lors de la génération des relances automatiques');
    }
  }

  async getStatsRelances() {
    try {
      const toutesRelances = await this.relanceRepository.findAllWithDetails();
      
      const stats = {
        total: toutesRelances.length,
        par_statut: {
          en_attente: toutesRelances.filter(r => r.statut === 'en_attente').length,
          envoyee: toutesRelances.filter(r => r.statut === 'envoyee').length,
          traitee: toutesRelances.filter(r => r.statut === 'traitee').length,
          annulee: toutesRelances.filter(r => r.statut === 'annulee').length
        },
        par_type: {
          paiement: toutesRelances.filter(r => r.type_relance === 'paiement').length,
          contrat: toutesRelances.filter(r => r.type_relance === 'contrat').length,
          echeance: toutesRelances.filter(r => r.type_relance === 'echeance').length,
          commerciale: toutesRelances.filter(r => r.type_relance === 'commerciale').length
        },
        par_canal: {
          email: toutesRelances.filter(r => r.canal === 'email').length,
          telephone: toutesRelances.filter(r => r.canal === 'telephone').length,
          courrier: toutesRelances.filter(r => r.canal === 'courrier').length,
          sms: toutesRelances.filter(r => r.canal === 'sms').length
        }
      };

      return stats;
    } catch (error) {
      console.error('Erreur RelanceService.getStatsRelances:', error);
      throw new Error('Erreur lors du calcul des statistiques');
    }
  }
}

export default RelanceService;
