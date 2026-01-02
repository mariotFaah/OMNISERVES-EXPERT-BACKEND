import { RelanceService } from '../services/RelanceService.js';
import { successResponse, errorResponse, notFoundResponse } from '../../../core/utils/response.js';

export class RelanceController {
  constructor() {
    this.relanceService = new RelanceService();
  }

  // Récupérer toutes les relances
  getAllRelances = async (req, res) => {
    try {
      const relances = await this.relanceService.getAllRelances();
      successResponse(res, 'Relances récupérées avec succès', relances);
    } catch (error) {
      console.error('Erreur RelanceController.getAllRelances:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer les relances d'un client
  getRelancesByClient = async (req, res) => {
    try {
      const { id } = req.params;
      const relances = await this.relanceService.getRelancesByClient(parseInt(id));
      successResponse(res, 'Relances client récupérées avec succès', relances);
    } catch (error) {
      console.error('Erreur RelanceController.getRelancesByClient:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer les relances par statut
  getRelancesByStatut = async (req, res) => {
    try {
      const { statut } = req.params;
      const relances = await this.relanceService.getRelancesByStatut(statut);
      successResponse(res, `Relances ${statut} récupérées avec succès`, relances);
    } catch (error) {
      console.error('Erreur RelanceController.getRelancesByStatut:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Créer une relance manuelle
  createRelance = async (req, res) => {
    try {
      const relanceData = req.body;
      const relance = await this.relanceService.createRelance(relanceData);
      successResponse(res, 'Relance créée avec succès', relance);
    } catch (error) {
      console.error('Erreur RelanceController.createRelance:', error);
      errorResponse(res, error.message, 400);
    }
  };

  // Mettre à jour le statut d'une relance
  updateRelanceStatut = async (req, res) => {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      
      const relance = await this.relanceService.updateRelanceStatut(parseInt(id), statut);
      successResponse(res, 'Statut relance mis à jour avec succès', relance);
    } catch (error) {
      console.error('Erreur RelanceController.updateRelanceStatut:', error);
      errorResponse(res, error.message, 400);
    }
  };

  // Générer les relances automatiques (paiements + contrats)
  genererRelancesAutomatiques = async (req, res) => {
    try {
      const result = await this.relanceService.genererRelancesAutomatiques();
      successResponse(res, 'Relances automatiques générées avec succès', result);
    } catch (error) {
      console.error('Erreur RelanceController.genererRelancesAutomatiques:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer les statistiques des relances
  getStatsRelances = async (req, res) => {
    try {
      const stats = await this.relanceService.getStatsRelances();
      successResponse(res, 'Statistiques relances récupérées avec succès', stats);
    } catch (error) {
      console.error('Erreur RelanceController.getStatsRelances:', error);
      errorResponse(res, error.message, 500);
    }
  };
}

export default RelanceController;