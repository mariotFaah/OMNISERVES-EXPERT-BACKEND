// src/modules/comptabilite/controllers/PaiementController.js
import { PaiementService } from '../services/PaiementService.js';
import { successResponse, errorResponse, createdResponse } from '../../../core/utils/response.js'; 

export class PaiementController {
  constructor() {
    this.paiementService = new PaiementService();
  }

  async create(req, res) {
    try {
      const paiement = await this.paiementService.enregistrerPaiement(req.body);
      createdResponse(res, 'Paiement enregistré avec succès', paiement);
    } catch (error) {
      console.error('❌ Erreur création paiement:', error);
      errorResponse(res, error.message);
    }
  }

  async getByFacture(req, res) {
    try {
      const { numero_facture } = req.params;
      
      if (!numero_facture) {
        return errorResponse(res, 'Numéro de facture requis', 400);
      }
      
      const paiements = await this.paiementService.getPaiementsFacture(numero_facture);
      successResponse(res, 'Paiements récupérés avec succès', paiements);
    } catch (error) {
      console.error('❌ Erreur récupération paiements facture:', error);
      errorResponse(res, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const paiements = await this.paiementService.getPaiements();
      successResponse(res, 'Paiements récupérés avec succès', paiements);
    } catch (error) {
      console.error('❌ Erreur récupération paiements:', error);
      errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const paiement = await this.paiementService.getPaiementById(req.params.id);
      if (!paiement) {
        return errorResponse(res, 'Paiement non trouvé', 404);
      }
      successResponse(res, 'Paiement récupéré avec succès', paiement); 
    } catch (error) {
      console.error('❌ Erreur récupération paiement:', error);
      errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const paiementMaj = await this.paiementService.updatePaiement(req.params.id, req.body);
      successResponse(res, 'Paiement mis à jour avec succès', paiementMaj); 
    } catch (error) {
      console.error('❌ Erreur mise à jour paiement:', error);
      errorResponse(res, error.message);
    }
  }
}