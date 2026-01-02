// src/modules/comptabilite/routes/articles.routes.js
import { Router } from 'express';
import { ArticleController } from '../controllers/ArticleController.js';
import { validateRequest } from '../../../core/middleware/validation.js';
import { 
  createArticleSchema, 
  updateArticleSchema, 
  updateStockSchema,
  adjustStockSchema 
} from '../validators/articles.validator.js';

import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = Router();
const articleController = new ArticleController();

// ✅ ROUTES PUBLIQUES - Lecture seule pour tous
router.get('/', articleController.getAll.bind(articleController));
router.get('/:code', articleController.getByCode.bind(articleController));
router.get('/statut/:statut', articleController.getByStockStatus.bind(articleController));
router.get('/:code/disponibilite', articleController.checkAvailability.bind(articleController));

// ✅ ROUTES PROTÉGÉES - Lecture pour utilisateurs authentifiés
router.get('/alertes/stock', 
  auth,
  requireRole('comptable'), 
  articleController.getStockAlerts.bind(articleController)
);

// ✅ ROUTES PROTÉGÉES - Écriture pour comptables et admin
router.post('/', 
  auth,
  requireRole('comptable'), 
  validateRequest(createArticleSchema), 
  articleController.create.bind(articleController)
);

router.put('/:code', 
  auth,
  requireRole('comptable'), 
  validateRequest(updateArticleSchema), 
  articleController.update.bind(articleController)
);

router.put('/:code/stock', 
  auth,
  requireRole('comptable'), 
  validateRequest(updateStockSchema), 
  articleController.updateStock.bind(articleController)
);

router.patch('/:code/stock/adjust', 
  auth,
  requireRole('comptable'), 
  validateRequest(adjustStockSchema), 
  articleController.adjustStock.bind(articleController)
);

// ✅ ROUTE PROTÉGÉE - Suppression admin seulement
router.delete('/:code', 
  auth,
  requireRole('admin'), 
  articleController.delete.bind(articleController)
);

export default router;