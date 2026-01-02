import { ContratService } from '../services/ContratService.js';
import { successResponse, errorResponse, createdResponse, notFoundResponse } from '../../../core/utils/response.js';

export class ContratController {
  constructor() {
    this.contratService = new ContratService();
  }

  // Récupérer tous les contrats
  getAllContrats = async (req, res) => {
    try {
      const contrats = await this.contratService.getAllContrats();
      successResponse(res, 'Contrats récupérés avec succès', contrats);
    } catch (error) {
      console.error('Erreur ContratController.getAllContrats:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer un contrat par ID
  getContratById = async (req, res) => {
    try {
      const { id } = req.params;
      const contrat = await this.contratService.getContratById(parseInt(id));
      successResponse(res, 'Contrat récupéré avec succès', contrat);
    } catch (error) {
      console.error('Erreur ContratController.getContratById:', error);
      notFoundResponse(res, error.message);
    }
  };

  // Récupérer les contrats d'un client
  getContratsByClient = async (req, res) => {
    try {
      const { clientId } = req.params;
      const contrats = await this.contratService.getContratsByClient(parseInt(clientId));
      successResponse(res, 'Contrats du client récupérés avec succès', contrats);
    } catch (error) {
      console.error('Erreur ContratController.getContratsByClient:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Créer un nouveau contrat
  createContrat = async (req, res) => {
    try {
      const contratData = req.body;
      const nouveauContrat = await this.contratService.createContrat(contratData);
      createdResponse(res, 'Contrat créé avec succès', nouveauContrat);
    } catch (error) {
      console.error('Erreur ContratController.createContrat:', error);
      errorResponse(res, error.message, 400);
    }
  };

  // Mettre à jour un contrat
  updateContrat = async (req, res) => {
    try {
      const { id } = req.params;
      const contratData = req.body;
      
      const contrat = await this.contratService.updateContrat(parseInt(id), contratData);
      successResponse(res, 'Contrat mis à jour avec succès', contrat);
    } catch (error) {
      console.error('Erreur ContratController.updateContrat:', error);
      errorResponse(res, error.message, 400);
    }
  };

  // Mettre à jour le statut d'un contrat
  updateContratStatut = async (req, res) => {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      
      const contrat = await this.contratService.updateContratStatut(parseInt(id), statut);
      successResponse(res, 'Statut du contrat mis à jour avec succès', contrat);
    } catch (error) {
      console.error('Erreur ContratController.updateContratStatut:', error);
      errorResponse(res, error.message, 400);
    }
  };

  // Récupérer les statistiques des contrats
  getContratStats = async (req, res) => {
    try {
      const stats = await this.contratService.getContratStats();
      successResponse(res, 'Statistiques des contrats récupérées avec succès', stats);
    } catch (error) {
      console.error('Erreur ContratController.getContratStats:', error);
      errorResponse(res, error.message, 500);
    }
  };
}

export default ContratController;