// src/modules/comptabilite/controllers/FactureController.js
import { successResponse, errorResponse, createdResponse } from '../../../core/utils/response.js';
import { FacturationService } from '../services/FacturationService.js';
import { JournalService } from '../services/JournalService.js';
import { FactureRepository } from '../repositories/FactureRepository.js';

export class FactureController {
  constructor() {
    this.facturationService = new FacturationService();
    this.journalService = new JournalService();
    this.factureRepository = new FactureRepository();
  }

  async getAll(req, res) {
    try {
      const factures = await this.facturationService.getFactures();
      successResponse(res, 'Factures récupérées avec succès', factures);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async create(req, res) {
    try {
      const nouvelleFacture = await this.facturationService.creerFacture(req.body);
      
      if (req.body.statut === 'validee') {
        await this.facturationService.calculerTotalsFacture(nouvelleFacture.numero_facture);
        
        const factureAvecTotaux = await this.facturationService.getFactureComplete(nouvelleFacture.numero_facture);
        
        if (factureAvecTotaux.total_ttc > 0) {
          await this.journalService.genererEcritureFacture(factureAvecTotaux);
          console.log('✅ Écritures comptables générées pour la facture', nouvelleFacture.numero_facture);
        } else {
          console.warn('⚠️ Facture sans totaux, écritures non générées');
        }
      }
      
      createdResponse(res, 'Facture créée avec succès', nouvelleFacture);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const facture = await this.facturationService.getFactureComplete(req.params.id);
      if (!facture) {
        return errorResponse(res, 'Facture non trouvée', 404);
      }
      successResponse(res, 'Facture récupérée avec succès', facture);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const numero = req.params.id;
      const factureData = req.body;

      const factureExistante = await this.factureRepository.findById(numero);
      if (!factureExistante) {
        return errorResponse(res, 'Facture non trouvée', 404);
      }

      const factureModifiee = await this.facturationService.updateFacture(numero, factureData);

      successResponse(res, 'Facture modifiée avec succès', factureModifiee);

    } catch (error) {
      console.error('❌ Erreur modification facture:', error);
      errorResponse(res, error.message);
    }
  }

  async annuler(req, res) {
    try {
      const factureAnnulee = await this.facturationService.annulerFacture(req.params.id);
      successResponse(res, 'Facture annulée avec succès', factureAnnulee);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async valider(req, res) {
    try {
      const factureValidee = await this.facturationService.validerFacture(req.params.id);
      
      await this.facturationService.calculerTotalsFacture(req.params.id);

      const factureAvecTotaux = await this.facturationService.getFactureComplete(req.params.id);
      
      await this.journalService.genererEcritureFacture(factureAvecTotaux);
      
      successResponse(res, 'Facture validée avec succès', factureValidee);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async enregistrerPaiement(req, res) {
    try {
      const { id } = req.params;
      const paiementData = {
        ...req.body,
        numero_facture: parseInt(id)
      };

      const resultat = await this.facturationService.enregistrerPaiement(paiementData);
      
      createdResponse(res, 'Paiement enregistré avec succès', resultat);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getHistoriquePaiements(req, res) {
    try {
      const { id } = req.params;
      const historique = await this.facturationService.getHistoriquePaiements(id);
      
      successResponse(res, 'Historique des paiements récupéré', historique);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async calculerPenalites(req, res) {
    try {
      const { id } = req.params;
      const penalites = await this.facturationService.calculerPenalites(id);
      
      successResponse(res, 'Pénalités calculées', penalites);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async configurerPaiement(req, res) {
    try {
      const { id } = req.params;
      const config = req.body;
      
      const factureConfig = await this.facturationService.configurerPaiementFlexible(id, config);
      
      successResponse(res, 'Configuration de paiement mise à jour', factureConfig);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getFacturesEnRetard(req, res) {
    try {
      const facturesEnRetard = await this.facturationService.verifierFacturesEnRetard();
      
      successResponse(res, 'Factures en retard récupérées', facturesEnRetard);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }
}

export default FactureController;