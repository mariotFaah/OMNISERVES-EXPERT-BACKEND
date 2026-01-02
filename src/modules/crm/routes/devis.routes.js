import { Router } from 'express';
import { DevisController } from '../controllers/DevisController.js';
// ✅ AJOUT :
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = Router();
const devisController = new DevisController();

// Routes pour les devis - PROTÉGÉES (commercial et admin)
router.get('/', 
  auth,
  requireRole('commercial'),
  devisController.getAllDevis
);

router.get('/stats', 
  auth,
  requireRole('commercial'),
  devisController.getDevisStats
);

router.get('/statut/:statut', 
  auth,
  requireRole('commercial'),
  devisController.getDevisByStatut
);

router.get('/:id', 
  auth,
  requireRole('commercial'),
  devisController.getDevisById
);

router.post('/', 
  auth,
  requireRole('commercial'),
  devisController.createDevis
);

router.put('/:id', 
  auth,
  requireRole('commercial'),
  devisController.updateDevis
);

router.patch('/:id/statut', 
  auth,
  requireRole('commercial'),
  devisController.updateDevisStatut
);

router.post('/:id/transformer-contrat', 
  auth,
  requireRole('commercial'),
  devisController.transformerEnContrat
);

export default router;
