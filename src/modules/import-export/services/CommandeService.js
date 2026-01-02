import CommandeRepository from '../repositories/CommandeRepository.js';
import ExpeditionRepository from '../repositories/ExpeditionRepository.js';
import CoutLogistiqueRepository from '../repositories/CoutLogistiqueRepository.js';

class CommandeService {
  constructor() {
    this.commandeRepository = new CommandeRepository();
    this.expeditionRepository = new ExpeditionRepository();
    this.coutLogistiqueRepository = new CoutLogistiqueRepository();
  }

  async getAllCommandes(filters = {}) {
    try {
      return await this.commandeRepository.findAllWithRelations(filters);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commandes: ${error.message}`);
    }
  }

  async getCommandeById(id) {
    try {
      const commande = await this.commandeRepository.findByIdWithRelations(id);
      if (!commande) {
        throw new Error('Commande non trouvée');
      }
      return commande;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la commande: ${error.message}`);
    }
  }

  async createCommande(commandeData, lignesData = []) {
    try {
      // Validation basique
      if (!commandeData.client_id || !commandeData.fournisseur_id) {
        throw new Error('Client et fournisseur sont obligatoires');
      }

      const commandeId = await this.commandeRepository.createWithLignes(commandeData, lignesData);
      return await this.getCommandeById(commandeId);
    } catch (error) {
      throw new Error(`Erreur lors de la création de la commande: ${error.message}`);
    }
  }

  async updateCommandeStatut(id, statut) {
    try {
      await this.commandeRepository.updateStatut(id, statut);
      return await this.getCommandeById(id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
    }
  }

  async updateExpedition(expeditionData) {
    try {
      await this.expeditionRepository.createOrUpdate(expeditionData);
      return await this.getCommandeById(expeditionData.commande_id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'expédition: ${error.message}`);
    }
  }

  async updateCoutsLogistiques(coutsData) {
    try {
      await this.coutLogistiqueRepository.createOrUpdate(coutsData);
      return await this.getCommandeById(coutsData.commande_id);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour des coûts logistiques: ${error.message}`);
    }
  }

  async calculerMarge(commandeId) {
    try {
      const commande = await this.getCommandeById(commandeId);
      
      if (!commande.couts_logistiques) {
        return {
          marge_brute: parseFloat(commande.montant_total),
          marge_nette: parseFloat(commande.montant_total),
          taux_marge: 100,
          total_couts: 0,
          chiffre_affaires: parseFloat(commande.montant_total)
        };
      }

      // Calculer le total des coûts logistiques
      const couts = commande.couts_logistiques;
      const totalCouts = [
        'fret_maritime', 'fret_aerien', 'assurance', 
        'droits_douane', 'frais_transit', 'transport_local', 'autres_frais'
      ].reduce((total, champ) => {
        return total + (parseFloat(couts[champ]) || 0);
      }, 0);

      const chiffreAffaires = parseFloat(commande.montant_total) || 0;
      const margeBrute = chiffreAffaires - totalCouts;
      const tauxMarge = chiffreAffaires > 0 ? (margeBrute / chiffreAffaires) * 100 : 0;

      return {
        marge_brute: margeBrute,
        marge_nette: margeBrute, 
        taux_marge: Math.round(tauxMarge * 100) / 100,
        total_couts: totalCouts,
        chiffre_affaires: chiffreAffaires
      };
    } catch (error) {
      throw new Error(`Erreur lors du calcul de la marge: ${error.message}`);
    }
  }
}

export default CommandeService;
