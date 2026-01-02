// src/modules/comptabilite/routes/tiers.routes.js
import { Router } from 'express';
import { TiersController } from '../controllers/TiersController.js';
import { validateRequest } from '../../../core/middleware/validation.js';
import { createTiersSchema, updateTiersSchema } from '../validators/tiers.validator.js';
// ✅ CORRECTION : Remplacer par le nouveau middleware
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = Router();
const tiersController = new TiersController();

// ✅ ROUTES PROTÉGÉES - Lecture pour utilisateurs authentifiés
router.get('/', 
  auth,
  requireRole('comptable'), // ✅ CORRECTION
  tiersController.getAll.bind(tiersController)
);

router.get('/:id', 
  auth,
  requireRole('comptable'), // ✅ CORRECTION
  tiersController.getById.bind(tiersController)
);

// ✅ ROUTES PROTÉGÉES - Écriture (comptable et admin seulement)
router.post('/', 
  auth,
  requireRole('comptable'), // ✅ CORRECTION
  validateRequest(createTiersSchema), 
  tiersController.create.bind(tiersController)
);

router.put('/:id', 
  auth,
  requireRole('comptable'), // ✅ CORRECTION
  validateRequest(updateTiersSchema), 
  tiersController.update.bind(tiersController)
);

// ✅ ROUTE PROTÉGÉE - Suppression (admin seulement)
router.delete('/:id', 
  auth,
  requireRole('admin'), // ✅ CORRECTION
  tiersController.delete.bind(tiersController)
);

export default router;