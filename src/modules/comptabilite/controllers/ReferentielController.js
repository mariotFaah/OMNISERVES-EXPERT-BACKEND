import { ReferentielService } from '../services/ReferentielService.js';
import { successResponse, errorResponse } from '../../../core/utils/response.js';

export class ReferentielController {
  constructor() {
    this.referentielService = new ReferentielService();
  }

  async getModesPaiement(req, res) {
    try {
      const modes = await this.referentielService.getModesPaiement();
      successResponse(res, 'Modes de paiement récupérés', modes);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getTypesFacture(req, res) {
    try {
      const types = await this.referentielService.getTypesFacture();
      successResponse(res, 'Types de facture récupérés', types);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getTauxTVA(req, res) {
    try {
      const taux = await this.referentielService.getTauxTVA();
      successResponse(res, 'Taux de TVA récupérés', taux);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getPlanComptable(req, res) {
    try {
      const plan = await this.referentielService.getPlanComptable();
      successResponse(res, 'Plan comptable récupéré', plan);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async addCompteComptable(req, res) {
    try {
      const compte = await this.referentielService.addCompteComptable(req.body);
      successResponse(res, 'Compte comptable ajouté avec succès', compte);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }
}