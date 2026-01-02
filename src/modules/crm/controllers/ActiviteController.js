import { ActiviteService } from '../services/ActiviteService.js';
import { successResponse, errorResponse, createdResponse } from '../../../core/utils/response.js';

export class ActiviteController {
  constructor() {
    this.activiteService = new ActiviteService();
  }

  // Créer une nouvelle activité
  createActivite = async (req, res) => {
    try {
      const activiteData = req.body;
      const nouvelleActivite = await this.activiteService.createActivite(activiteData);
      createdResponse(res, 'Activité créée avec succès', nouvelleActivite);
    } catch (error) {
      console.error('Erreur ActiviteController.createActivite:', error);
      errorResponse(res, error.message, 400);
    }
  };

  // Récupérer les activités d'un client
  getActivitesByClient = async (req, res) => {
    try {
      const { id } = req.params;
      const activites = await this.activiteService.getActivitesByClient(parseInt(id));
      successResponse(res, 'Activités récupérées avec succès', activites);
    } catch (error) {
      console.error('Erreur ActiviteController.getActivitesByClient:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer toutes les activités
  getAllActivites = async (req, res) => {
    try {
      const activites = await this.activiteService.getAllActivites();
      successResponse(res, 'Activités récupérées avec succès', activites);
    } catch (error) {
      console.error('Erreur ActiviteController.getAllActivites:', error);
      errorResponse(res, error.message, 500);
    }
  };
}

export default ActiviteController;