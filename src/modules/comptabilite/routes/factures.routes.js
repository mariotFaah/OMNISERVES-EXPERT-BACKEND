import express from 'express';
import { FactureController } from '../controllers/FactureController.js';
// ✅ CORRECTION :
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = express.Router();
const factureController = new FactureController();

// ✅ ROUTES PROTÉGÉES - Lecture pour utilisateurs authentifiés
router.get('/', 
  auth,
  requireRole('comptable'),
  factureController.getAll.bind(factureController)
);

router.get('/:id', 
  auth,
  requireRole('comptable'),
  factureController.getById.bind(factureController)
);

router.get('/:id/paiements', 
  auth,
  requireRole('comptable'),
  factureController.getHistoriquePaiements.bind(factureController)
);

router.get('/:id/penalites', 
  auth,
  requireRole('comptable'),
  factureController.calculerPenalites.bind(factureController)
);

router.get('/statut/en-retard', 
  auth,
  requireRole('comptable'),
  factureController.getFacturesEnRetard.bind(factureController)
);

// ✅ ROUTES PROTÉGÉES - Écriture (comptable et admin seulement)
router.post('/', 
  auth,
  requireRole('comptable'),
  factureController.create.bind(factureController)
);

router.put('/:id', 
  auth,
  requireRole('comptable'),
  factureController.update.bind(factureController)
);

router.post('/:id/paiements', 
  auth,
  requireRole('comptable'),
  factureController.enregistrerPaiement.bind(factureController)
);

router.patch('/:id/config-paiement', 
  auth,
  requireRole('comptable'),
  factureController.configurerPaiement.bind(factureController)
);

// ✅ ROUTES PROTÉGÉES - Validation/Annulation (comptable et admin seulement)
router.patch('/:id/valider', 
  auth,
  requireRole('comptable'),
  factureController.valider.bind(factureController)
);

router.patch('/:id/annuler', 
  auth,
  requireRole('comptable'),
  factureController.annuler.bind(factureController)
);

export default router;