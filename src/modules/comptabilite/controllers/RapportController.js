// src/modules/comptabilite/controllers/RapportController.js
import { RapportService } from '../services/RapportService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';

export class RapportController {
  constructor() {
    this.rapportService = new RapportService();
  }

  async bilan(req, res) {
    try {
      const { date_fin } = req.query;
      const bilan = await this.rapportService.genererBilan(date_fin);
      sendSuccess(res, 'Bilan généré avec succès', bilan);
    } catch (error) {
      sendError(res, error.message, 500);
    }
  }

  async compteResultat(req, res) {
    try {
      const { date_debut, date_fin } = req.query;
      const resultat = await this.rapportService.genererCompteResultat(date_debut, date_fin);
      sendSuccess(res, 'Compte de résultat généré avec succès', resultat);
    } catch (error) {
      sendError(res, error.message, 500);
    }
  }

  async tresorerie(req, res) {
    try {
      const { date_debut, date_fin } = req.query;
      const tresorerie = await this.rapportService.genererTresorerie(date_debut, date_fin);
      sendSuccess(res, 'Rapport de trésorerie généré avec succès', tresorerie);
    } catch (error) {
      sendError(res, error.message, 500);
    }
  }

  async tva(req, res) {
    try {
      const { date_debut, date_fin } = req.query;
      const tva = await this.rapportService.genererRapportTVA(date_debut, date_fin);
      sendSuccess(res, 'Déclaration TVA générée avec succès', tva);
    } catch (error) {
      sendError(res, error.message, 500);
    }
  }
}

export default RapportController;