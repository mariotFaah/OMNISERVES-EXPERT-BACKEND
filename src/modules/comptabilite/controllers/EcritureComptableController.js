// src/modules/comptabilite/controllers/EcritureComptableController.js
import { EcritureComptableRepository } from '../repositories/EcritureComptableRepository.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';

export class EcritureComptableController {
  constructor() {
    this.ecritureRepo = new EcritureComptableRepository();
  }

  // GET /ecritures - Liste toutes les écritures
  async getAll(req, res) {
    try {
      const { journal, date_debut, date_fin, page = 1, limit = 50 } = req.query;
      
      let ecritures;
      
      if (journal) {
        ecritures = await this.ecritureRepo.findByJournal(journal, date_debut, date_fin);
      } else {
        const offset = (page - 1) * limit;
        ecritures = await this.ecritureRepo.query()
          .orderBy('date', 'desc')
          .orderBy('numero_ecriture', 'desc')
          .offset(offset)
          .limit(parseInt(limit));
      }
      
      sendSuccess(res, 'Écritures récupérées avec succès', ecritures);
    } catch (error) {
      // AVANT : sendError(res, 500, error.message);
      // APRÈS :
      sendError(res, error.message, 500);
    }
  }

  // GET /ecritures/:id - Détail d'une écriture
  async getById(req, res) {
    try {
      const { id } = req.params;
      const ecriture = await this.ecritureRepo.query()
        .where('id_ecriture', id)
        .first();
      
      if (!ecriture) {
        // AVANT : sendError(res, 404, 'Écriture non trouvée');
        // APRÈS :
        return sendError(res, 'Écriture non trouvée', 404);
      }
      
      sendSuccess(res, 'Écriture récupérée avec succès', ecriture);
    } catch (error) {
      // AVANT : sendError(res, 500, error.message);
      // APRÈS :
      sendError(res, error.message, 500);
    }
  }

  // POST /ecritures - Créer une écriture manuelle
  async create(req, res) {
    try {
      const ecritureData = req.body;
      
      // Générer le numéro d'écriture
      const numero_ecriture = await this.ecritureRepo.getNextNumeroEcriture();
      
      const ecritureComplete = {
        ...ecritureData,
        numero_ecriture,
        date: ecritureData.date || new Date()
      };
      
      const nouvelleEcriture = await this.ecritureRepo.create(ecritureComplete);
      // AVANT : sendSuccess(res, 'Écriture créée avec succès', nouvelleEcriture, 201);
      // APRÈS :
      sendSuccess(res, 'Écriture créée avec succès', nouvelleEcriture);
    } catch (error) {
      // AVANT : sendError(res, 500, error.message);
      // APRÈS :
      sendError(res, error.message, 500);
    }
  }

  // GET /ecritures/journal/:type - Écritures par journal
  async getByJournal(req, res) {
    try {
      const { type } = req.params;
      const { date_debut, date_fin } = req.query;
      
      const ecritures = await this.ecritureRepo.findByJournal(type, date_debut, date_fin);
      sendSuccess(res, `Écritures du journal ${type} récupérées`, ecritures);
    } catch (error) {
      // AVANT : sendError(res, 500, error.message);
      // APRÈS :
      sendError(res, error.message, 500);
    }
  }
}

export default EcritureComptableController;