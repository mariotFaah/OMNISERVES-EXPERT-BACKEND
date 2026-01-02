import TransporteurService from '../services/TransporteurService.js';
import { sendSuccess, sendError, sendCreated } from '../../../core/utils/response.js';

class TransporteurController {
  constructor() {
    this.transporteurService = new TransporteurService();
  }

  getAll = async (req, res) => {
    try {
      const transporteurs = await this.transporteurService.getAllTransporteurs();
      sendSuccess(res, 'Transporteurs récupérés avec succès', transporteurs);
    } catch (error) {
      console.error('Erreur TransporteurController.getAll:', error);
      sendError(res, error.message, 500);
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const transporteur = await this.transporteurService.getTransporteurById(parseInt(id));
      if (!transporteur) {
        return sendError(res, 'Transporteur non trouvé', 404);
      }
      sendSuccess(res, 'Transporteur récupéré avec succès', transporteur);
    } catch (error) {
      console.error('Erreur TransporteurController.getById:', error);
      sendError(res, error.message, 500);
    }
  };

  create = async (req, res) => {
    try {
      const transporteurData = req.body;
      const transporteur = await this.transporteurService.createTransporteur(transporteurData);
      sendCreated(res, 'Transporteur créé avec succès', transporteur);
    } catch (error) {
      console.error('Erreur TransporteurController.create:', error);
      sendError(res, error.message, 400);
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const transporteurData = req.body;
      const transporteur = await this.transporteurService.updateTransporteur(parseInt(id), transporteurData);
      sendSuccess(res, 'Transporteur mis à jour avec succès', transporteur);
    } catch (error) {
      console.error('Erreur TransporteurController.update:', error);
      sendError(res, error.message, 400);
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;
      await this.transporteurService.deleteTransporteur(parseInt(id));
      sendSuccess(res, 'Transporteur supprimé avec succès', null);
    } catch (error) {
      console.error('Erreur TransporteurController.delete:', error);
      sendError(res, error.message, 400);
    }
  };

  search = async (req, res) => {
    try {
      const { q } = req.query;
      const transporteurs = await this.transporteurService.searchTransporteurs(q);
      sendSuccess(res, 'Recherche effectuée avec succès', transporteurs);
    } catch (error) {
      console.error('Erreur TransporteurController.search:', error);
      sendError(res, error.message, 500);
    }
  };

  getByType = async (req, res) => {
    try {
      const { type } = req.params;
      const transporteurs = await this.transporteurService.getTransporteursByType(type);
      sendSuccess(res, `Transporteurs ${type} récupérés avec succès`, transporteurs);
    } catch (error) {
      console.error('Erreur TransporteurController.getByType:', error);
      sendError(res, error.message, 500);
    }
  };
}

export default TransporteurController;