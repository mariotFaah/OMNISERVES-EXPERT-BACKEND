// src/modules/comptabilite/controllers/EmailController.js
import EmailService from '../services/EmailService.js';
import { sendSuccess, sendError } from '../../../core/utils/response.js';

export class EmailController {
  constructor() {
    this.emailService = new EmailService();
  }

  async envoyerRelance(req, res) {
    try {
      console.log('📧 Requête relance reçue:', req.body);
      
      const { numero_facture, email_client, nom_client, montant, jours_retard, message_personnalise } = req.body;

      if (!numero_facture || !email_client || !nom_client || !montant) {
        return sendError(res, 'Données manquantes: numero_facture, email_client, nom_client et montant sont requis', 400);
      }

      const resultat = await this.emailService.envoyerRelance({
        numero_facture,
        email_client,
        nom_client,
        montant,
        jours_retard: jours_retard || 0,
        message_personnalise
      });

      sendSuccess(res, 'Relance envoyée avec succès', resultat);

    } catch (error) {
      console.error('❌ Erreur EmailController.envoyerRelance:', error);
      sendError(res, error.message, 500);
    }
  }

  async envoyerRelancesGroupees(req, res) {
    try {
      console.log('📧 Requête relances groupées reçue:', req.body.factures?.length, 'factures');
      
      const { factures } = req.body;

      if (!factures || !Array.isArray(factures)) {
        return sendError(res, 'Tableau de factures requis', 400);
      }

      const resultat = await this.emailService.envoyerRelancesGroupees(factures);

      sendSuccess(res, `Relances groupées envoyées: ${resultat.reussis}/${resultat.total} réussies`, resultat);

    } catch (error) {
      console.error('❌ Erreur EmailController.envoyerRelancesGroupees:', error);
      sendError(res, error.message, 500);
    }
  }

  async testerConfiguration(req, res) {
    try {
      const resultat = await this.emailService.testConfiguration();
      sendSuccess(res, 'Configuration email testée avec succès', resultat);
    } catch (error) {
      console.error('❌ Erreur test configuration email:', error);
      sendError(res, error.message, 500);
    }
  }
}

export default EmailController;