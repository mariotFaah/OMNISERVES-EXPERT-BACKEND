import express from 'express';
import { StatistiqueController } from '../controllers/StatistiqueController.js';
// ✅ CORRECTION :
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = express.Router();
const statistiqueController = new StatistiqueController();

// ✅ ROUTES PROTÉGÉES - Statistiques financières (comptable et admin seulement)
router.get('/chiffre-affaire', 
  auth,
  requireRole('comptable'),
  statistiqueController.getChiffreAffaire.bind(statistiqueController)
);

router.get('/top-clients', 
  auth,
  requireRole('comptable'),
  statistiqueController.getTopClients.bind(statistiqueController)
);

router.get('/top-produits', 
  auth,
  requireRole('comptable'),
  statistiqueController.getTopProduits.bind(statistiqueController)
);

router.get('/indicateurs', 
  auth,
  requireRole('comptable'),
  statistiqueController.getIndicateurs.bind(statistiqueController)
);

export default router;