import express from 'express';
import { ReferentielController } from '../controllers/ReferentielController.js';
// ✅ CORRECTION :
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = express.Router();
const referentielController = new ReferentielController();

// ✅ ROUTES PUBLIQUES - Référentiels de base (accessibles à tous)
router.get('/modes-paiement', referentielController.getModesPaiement.bind(referentielController));
router.get('/types-facture', referentielController.getTypesFacture.bind(referentielController));
router.get('/taux-tva', referentielController.getTauxTVA.bind(referentielController));

// ✅ ROUTES PROTÉGÉES - Plan comptable (utilisateurs authentifiés)
router.get('/plan-comptable', 
  auth,
  requireRole('comptable'),
  referentielController.getPlanComptable.bind(referentielController)
);

// ✅ ROUTE PROTÉGÉE - Ajout compte (comptable et admin seulement)
router.post('/plan-comptable', 
  auth,
  requireRole('comptable'),
  (req, res) => referentielController.addCompteComptable(req, res)
);

export default router;