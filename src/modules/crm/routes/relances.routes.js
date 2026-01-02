import { Router } from 'express';
import { RelanceController } from '../controllers/RelanceController.js';
// ✅ AJOUT :
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = Router();
const relanceController = new RelanceController();

// Routes pour les relances - PROTÉGÉES (commercial et admin)
router.get('/', 
  auth,
  requireRole('commercial'),
  relanceController.getAllRelances
);

router.get('/stats', 
  auth,
  requireRole('commercial'),
  relanceController.getStatsRelances
);

router.get('/client/:id', 
  auth,
  requireRole('commercial'),
  relanceController.getRelancesByClient
);

router.get('/statut/:statut', 
  auth,
  requireRole('commercial'),
  relanceController.getRelancesByStatut
);

router.post('/', 
  auth,
  requireRole('commercial'),
  relanceController.createRelance
);

router.post('/automatiques', 
  auth,
  requireRole('commercial'),
  relanceController.genererRelancesAutomatiques
);

router.patch('/:id/statut', 
  auth,
  requireRole('commercial'),
  relanceController.updateRelanceStatut
);

export default router;
