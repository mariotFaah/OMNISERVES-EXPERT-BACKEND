import { Router } from 'express';
import EmailController from '../controllers/EmailController.js';
// ✅ CORRECTION :
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = Router();
const controller = new EmailController();

// ✅ ROUTES PROTÉGÉES - Envoi d'emails (comptable et admin seulement)
router.post('/relance', 
  auth,
  requireRole('comptable'),
  (req, res) => controller.envoyerRelance(req, res)
);

router.post('/relances-groupees', 
  auth,
  requireRole('comptable'),
  (req, res) => controller.envoyerRelancesGroupees(req, res)
);

// ✅ ROUTE PROTÉGÉE - Test configuration (admin seulement)
router.get('/test-config', 
  auth,
  requireRole('admin'),
  (req, res) => controller.testerConfiguration(req, res)
);

export default router;