import CommandeService from '../services/CommandeService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';

class CommandeController {
  constructor() {
    this.commandeService = new CommandeService();
  }

  getAll = async (req, res) => {
    try {
      const filters = req.query;
      const commandes = await this.commandeService.getAllCommandes(filters);
      sendSuccess(res, 'Liste des commandes récupérée avec succès', commandes);
    } catch (error) {
      sendError(res, error.message, 500);
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const commande = await this.commandeService.getCommandeById(parseInt(id));
      sendSuccess(res, 'Commande récupérée avec succès', commande);
    } catch (error) {
      sendError(res, error.message, 404);
    }
  };

  create = async (req, res) => {
    try {
      const { lignes, ...commandeData } = req.body;
      const commande = await this.commandeService.createCommande(commandeData, lignes);
      sendSuccess(res, 'Commande créée avec succès', commande);
    } catch (error) {
      sendError(res, error.message, 400);
    }
  };

  updateStatut = async (req, res) => {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      const commande = await this.commandeService.updateCommandeStatut(parseInt(id), statut);
      sendSuccess(res, 'Statut de la commande mis à jour avec succès', commande);
    } catch (error) {
      sendError(res, error.message, 400);
    }
  };

  updateExpedition = async (req, res) => {
    try {
      const expeditionData = req.body;
      const commande = await this.commandeService.updateExpedition(expeditionData);
      sendSuccess(res, 'Expédition mise à jour avec succès', commande);
    } catch (error) {
      sendError(res, error.message, 400);
    }
  };

  updateCouts = async (req, res) => {
    try {
      const coutsData = req.body;
      const commande = await this.commandeService.updateCoutsLogistiques(coutsData);
      sendSuccess(res, 'Coûts logistiques mis à jour avec succès', commande);
    } catch (error) {
      sendError(res, error.message, 400);
    }
  };

  calculerMarge = async (req, res) => {
    try {
      const { id } = req.params;
      const marge = await this.commandeService.calculerMarge(parseInt(id));
      sendSuccess(res, 'Calcul de marge effectué avec succès', marge);
    } catch (error) {
      sendError(res, error.message, 400);
    }
  };
}

export default CommandeController;