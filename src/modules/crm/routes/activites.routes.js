import express from 'express';
import { ActiviteController } from '../controllers/ActiviteController.js';
// ✅ AJOUT :
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = express.Router();
const activiteController = new ActiviteController();

// Routes pour les activités - PROTÉGÉES (commercial et admin)
router.post('/', 
  auth,
  requireRole('commercial'),
  activiteController.createActivite
);

router.get('/', 
  auth,
  requireRole('commercial'),
  activiteController.getAllActivites
);

router.get('/client/:id', 
  auth,
  requireRole('commercial'),
  activiteController.getActivitesByClient
);

export default router;