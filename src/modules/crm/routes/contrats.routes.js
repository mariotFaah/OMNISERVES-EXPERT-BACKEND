import express from 'express';
import { ContratController } from '../controllers/ContratController.js';
// ✅ AJOUT :
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = express.Router();
const contratController = new ContratController();

// Routes pour les contrats - PROTÉGÉES (commercial et admin)
router.get('/', 
  auth,
  requireRole('commercial'),
  contratController.getAllContrats
);

router.get('/stats', 
  auth,
  requireRole('commercial'),
  contratController.getContratStats
);

router.get('/:id', 
  auth,
  requireRole('commercial'),
  contratController.getContratById
);

router.post('/', 
  auth,
  requireRole('commercial'),
  contratController.createContrat
);

router.put('/:id', 
  auth,
  requireRole('commercial'),
  contratController.updateContrat
);

router.patch('/:id/statut', 
  auth,
  requireRole('commercial'),
  contratController.updateContratStatut
);

export default router;