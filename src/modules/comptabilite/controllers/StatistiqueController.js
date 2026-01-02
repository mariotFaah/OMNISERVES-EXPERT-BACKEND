// src/modules/comptabilite/controllers/StatistiqueController.js
import { StatistiqueService } from '../services/StatistiqueService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';

export class StatistiqueController {
  constructor() {
    this.statistiqueService = new StatistiqueService();
  }

  async getChiffreAffaire(req, res) {
    try {
      const { date_debut, date_fin } = req.query;
      const ca = await this.statistiqueService.getChiffreAffaire(date_debut, date_fin);
      sendSuccess(res, 'Chiffre d\'affaire calculé avec succès', ca);
    } catch (error) {
      console.error('❌ Erreur StatistiqueController.getChiffreAffaire:', error);
      sendError(res, error.message, 500);
    }
  }

  async getTopClients(req, res) {
    try {
      const { limit = 10 } = req.query;
      const topClients = await this.statistiqueService.getTopClients(parseInt(limit));
      sendSuccess(res, 'Top clients récupéré avec succès', topClients);
    } catch (error) {
      console.error('❌ Erreur StatistiqueController.getTopClients:', error);
      sendError(res, error.message, 500);
    }
  }

  async getTopProduits(req, res) {
    try {
      const { limit = 10 } = req.query;
      const topProduits = await this.statistiqueService.getTopProduits(parseInt(limit));
      sendSuccess(res, 'Top produits récupéré avec succès', topProduits);
    } catch (error) {
      console.error('❌ Erreur StatistiqueController.getTopProduits:', error);
      sendError(res, error.message, 500);
    }
  }

  async getIndicateurs(req, res) {
    try {
      const indicateurs = await this.statistiqueService.getIndicateurs();
      sendSuccess(res, 'Indicateurs récupérés avec succès', indicateurs);
    } catch (error) {
      console.error('❌ Erreur StatistiqueController.getIndicateurs:', error);
      sendError(res, error.message, 500);
    }
  }
}

export default StatistiqueController;