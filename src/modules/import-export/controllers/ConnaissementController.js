import ConnaissementService from '../services/ConnaissementService.js';
import { sendSuccess, sendError, sendCreated } from '../../../core/utils/response.js';

class ConnaissementController {
  constructor() {
    this.connaissementService = new ConnaissementService();
  }

  getAll = async (req, res) => {
    try {
      const connaissements = await this.connaissementService.getAllConnaissements();
      sendSuccess(res, 'Connaissements récupérés avec succès', connaissements);
    } catch (error) {
      console.error('Erreur ConnaissementController.getAll:', error);
      sendError(res, error.message, 500);
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const connaissement = await this.connaissementService.getConnaissementById(parseInt(id));
      if (!connaissement) {
        return sendError(res, 'Connaissement non trouvé', 404);
      }
      sendSuccess(res, 'Connaissement récupéré avec succès', connaissement);
    } catch (error) {
      console.error('Erreur ConnaissementController.getById:', error);
      sendError(res, error.message, 500);
    }
  };

  getByExpedition = async (req, res) => {
    try {
      const { expeditionId } = req.params;
      const connaissement = await this.connaissementService.getConnaissementByExpedition(parseInt(expeditionId));
      sendSuccess(res, 'Connaissement de l\'expédition récupéré avec succès', connaissement);
    } catch (error) {
      console.error('Erreur ConnaissementController.getByExpedition:', error);
      sendError(res, error.message, 500);
    }
  };

  getByNumero = async (req, res) => {
    try {
      const { numero } = req.params;
      const connaissement = await this.connaissementService.getConnaissementByNumero(numero);
      if (!connaissement) {
        return sendError(res, 'Connaissement non trouvé', 404);
      }
      sendSuccess(res, 'Connaissement récupéré avec succès', connaissement);
    } catch (error) {
      console.error('Erreur ConnaissementController.getByNumero:', error);
      sendError(res, error.message, 500);
    }
  };

  create = async (req, res) => {
    try {
      const connaissementData = req.body;
      const connaissement = await this.connaissementService.createConnaissement(connaissementData);
      sendCreated(res, 'Connaissement créé avec succès', connaissement);
    } catch (error) {
      console.error('Erreur ConnaissementController.create:', error);
      sendError(res, error.message, 400);
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const connaissementData = req.body;
      const connaissement = await this.connaissementService.updateConnaissement(parseInt(id), connaissementData);
      sendSuccess(res, 'Connaissement mis à jour avec succès', connaissement);
    } catch (error) {
      console.error('Erreur ConnaissementController.update:', error);
      sendError(res, error.message, 400);
    }
  };

  updateStatut = async (req, res) => {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      const connaissement = await this.connaissementService.updateStatutConnaissement(parseInt(id), statut);
      sendSuccess(res, 'Statut du connaissement mis à jour avec succès', connaissement);
    } catch (error) {
      console.error('Erreur ConnaissementController.updateStatut:', error);
      sendError(res, error.message, 400);
    }
  };

  getByStatut = async (req, res) => {
    try {
      const { statut } = req.params;
      const connaissements = await this.connaissementService.getConnaissementsByStatut(statut);
      sendSuccess(res, `Connaissements ${statut} récupérés avec succès`, connaissements);
    } catch (error) {
      console.error('Erreur ConnaissementController.getByStatut:', error);
      sendError(res, error.message, 500);
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await this.connaissementService.deleteConnaissement(parseInt(id));
      sendSuccess(res, 'Connaissement supprimé avec succès', null);
    } catch (error) {
      console.error('Erreur ConnaissementController.delete:', error);
      sendError(res, error.message, 400);
    }
  };
}

export default ConnaissementController;