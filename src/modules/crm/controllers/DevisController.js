import { DevisService } from '../services/DevisService.js';
import { successResponse, errorResponse, createdResponse, notFoundResponse } from '../../../core/utils/response.js';

export class DevisController {
  constructor() {
    this.devisService = new DevisService();
  }

  // Récupérer tous les devis
  getAllDevis = async (req, res) => {
    try {
      const devis = await this.devisService.getAllDevis();
      successResponse(res, 'Devis récupérés avec succès', devis);
    } catch (error) {
      console.error('Erreur DevisController.getAllDevis:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer un devis par ID
  getDevisById = async (req, res) => {
    try {
      const { id } = req.params;
      const devis = await this.devisService.getDevisById(parseInt(id));
      successResponse(res, 'Devis récupéré avec succès', devis);
    } catch (error) {
      console.error('Erreur DevisController.getDevisById:', error);
      notFoundResponse(res, error.message);
    }
  };

  // Créer un nouveau devis
  createDevis = async (req, res) => {
    try {
      const devisData = req.body;
      const nouveauDevis = await this.devisService.createDevis(devisData);
      createdResponse(res, 'Devis créé avec succès', nouveauDevis);
    } catch (error) {
      console.error('Erreur DevisController.createDevis:', error);
      errorResponse(res, error.message, 400);
    }
  };

  // Mettre à jour un devis
  updateDevis = async (req, res) => {
    try {
      const { id } = req.params;
      const devisData = req.body;
      
      const devis = await this.devisService.updateDevis(parseInt(id), devisData);
      successResponse(res, 'Devis mis à jour avec succès', devis);
    } catch (error) {
      console.error('Erreur DevisController.updateDevis:', error);
      errorResponse(res, error.message, 400);
    }
  };

  // Mettre à jour le statut d'un devis
  updateDevisStatut = async (req, res) => {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      
      const devis = await this.devisService.updateDevisStatut(parseInt(id), statut);
      successResponse(res, 'Statut du devis mis à jour avec succès', devis);
    } catch (error) {
      console.error('Erreur DevisController.updateDevisStatut:', error);
      errorResponse(res, error.message, 400);
    }
  };

  // Récupérer les statistiques des devis
  getDevisStats = async (req, res) => {
    try {
      const stats = await this.devisService.getDevisStats();
      successResponse(res, 'Statistiques des devis récupérées avec succès', stats);
    } catch (error) {
      console.error('Erreur DevisController.getDevisStats:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer les devis par statut
  getDevisByStatut = async (req, res) => {
    try {
      const { statut } = req.params;
      const devis = await this.devisService.getDevisByStatut(statut);
      successResponse(res, `Devis ${statut} récupérés avec succès`, devis);
    } catch (error) {
      console.error('Erreur DevisController.getDevisByStatut:', error);
      errorResponse(res, error.message, 500);
    }
  };

  transformerEnContrat = async (req, res) => {
    try {
      const { id } = req.params;
      const donneesContrat = req.body;
      
      const contrat = await this.devisService.transformerDevisEnContrat(
        parseInt(id), 
        donneesContrat
      );
      
      successResponse(res, 'Devis transformé en contrat avec succès', contrat);
    } catch (error) {
      console.error('Erreur transformation devis en contrat:', error);
      errorResponse(res, error.message, 400);
    }
  };
}

export default DevisController;