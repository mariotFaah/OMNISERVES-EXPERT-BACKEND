import { successResponse, errorResponse, createdResponse } from '../../../core/utils/response.js';
import { TiersService } from '../services/TiersService.js';

export class TiersController {
  constructor() {
    this.tiersService = new TiersService();
  }

  async getAll(req, res) {
    try {
      const tiers = await this.tiersService.getTiers();
      successResponse(res, 'Tiers récupérés avec succès', tiers);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async create(req, res) {
    try {
      const nouveauTiers = await this.tiersService.createTiers(req.body);
      createdResponse(res, 'Tiers créé avec succès', nouveauTiers);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const tiers = await this.tiersService.getTiersById(req.params.id);
      if (!tiers) {
        return errorResponse(res, 'Tiers non trouvé', 404);
      }
      successResponse(res, 'Tiers récupéré avec succès', tiers);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const tiersMaj = await this.tiersService.updateTiers(req.params.id, req.body);
      successResponse(res, 'Tiers mis à jour avec succès', tiersMaj);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      await this.tiersService.deleteTiers(req.params.id);
      successResponse(res, 'Tiers supprimé avec succès', null);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }
}

export default TiersController;