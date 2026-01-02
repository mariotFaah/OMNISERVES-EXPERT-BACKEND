import express from 'express';
import { PaiementController } from '../controllers/PaiementController.js';
// ✅ CORRECTION :
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = express.Router();
const paiementController = new PaiementController();

// ✅ ROUTES PROTÉGÉES - Lecture pour utilisateurs authentifiés
router.get('/', 
  auth,
  requireRole('comptable'),
  paiementController.getAll.bind(paiementController)
);

router.get('/facture/:numero_facture', 
  auth,
  requireRole('comptable'),
  paiementController.getByFacture.bind(paiementController)
);

router.get('/:id', 
  auth,
  requireRole('comptable'),
  paiementController.getById.bind(paiementController)
);

// ✅ ROUTES PROTÉGÉES - Écriture (comptable et admin seulement)
router.post('/', 
  auth,
  requireRole('comptable'),
  paiementController.create.bind(paiementController)
);

router.put('/:id', 
  auth,
  requireRole('comptable'),
  paiementController.update.bind(paiementController)
);

export default router;