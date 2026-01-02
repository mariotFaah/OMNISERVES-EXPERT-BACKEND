import { DeviseService } from '../services/DeviseService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';

export class DeviseController {
  constructor() {
    this.deviseService = new DeviseService();
  }

  async convertir(req, res) {
    try {
      const { montant, devise_source, devise_cible, date } = req.body;
      const resultat = await this.deviseService.convertirMontant(
        montant, 
        devise_source, 
        devise_cible, 
        date
      );
      sendSuccess(res, 'Conversion effectuée avec succès', { montant_converti: resultat });
    } catch (error) {
      // AVANT : sendError(res, 500, error.message);
      // APRÈS :
      sendError(res, error.message, 500);
      //         ↑ res   ↑ message   ↑ statusCode
    }
  }

  async updateTaux(req, res) {
    try {
      const { devise_source, devise_cible, taux, date_effet } = req.body;
      const nouveauTaux = await this.deviseService.mettreAJourTaux(
        devise_source,
        devise_cible,
        taux,
        date_effet
      );
      sendSuccess(res, 'Taux de change mis à jour', nouveauTaux);
    } catch (error) {
      // AVANT : sendError(res, 500, error.message);
      // APRÈS :
      sendError(res, error.message, 500);
    }
  }

  async getTauxActifs(req, res) {
    try {
      const tauxActifs = await this.deviseService.tauxChangeRepo.findAllActifs();
      sendSuccess(res, 'Taux de change actifs récupérés', tauxActifs);
    } catch (error) {
      // AVANT : sendError(res, 500, error.message);
      // APRÈS :
      sendError(res, error.message, 500);
    }
  }
}

export default DeviseController;