import express from 'express';
import { EcritureComptableController } from '../controllers/EcritureComptableController.js';
// ✅ CORRECTION :
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = express.Router();
const ecritureController = new EcritureComptableController();

// ✅ ROUTES PROTÉGÉES - Lecture pour utilisateurs authentifiés
router.get('/', 
  auth,
  requireRole('comptable'),
  ecritureController.getAll.bind(ecritureController)
);

router.get('/journal/:type', 
  auth,
  requireRole('comptable'),
  ecritureController.getByJournal.bind(ecritureController)
);

router.get('/:id', 
  auth,
  requireRole('comptable'),
  ecritureController.getById.bind(ecritureController)
);

// ✅ ROUTE PROTÉGÉE - Écriture manuelle (comptable et admin seulement)
router.post('/', 
  auth,
  requireRole('comptable'),
  ecritureController.create.bind(ecritureController)
);

export default router;