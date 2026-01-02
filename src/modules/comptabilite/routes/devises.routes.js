import express from 'express';
import { DeviseController } from '../controllers/DeviseController.js';
// ✅ CORRECTION :
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = express.Router();
const deviseController = new DeviseController();

// ✅ ROUTES PUBLIQUES - Conversion et consultation des taux (accessible à tous)
router.post('/convertir', deviseController.convertir.bind(deviseController));
router.get('/taux', deviseController.getTauxActifs.bind(deviseController));

// ✅ ROUTE PROTÉGÉE - Mise à jour des taux (comptable et admin seulement)
router.post('/taux', 
  auth,
  requireRole('comptable'),
  deviseController.updateTaux.bind(deviseController)
);

// ✅ ROUTE RACINE TEMPORAIRE (publique)
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Module Devises fonctionnel',
    endpoints: {
      convertir: 'POST /api/comptabilite/devises/convertir',
      taux: 'GET /api/comptabilite/devises/taux',
      updateTaux: 'POST /api/comptabilite/devises/taux (authentifié)'
    },
    acces: {
      public: ['conversion', 'consultation taux'],
      authentifie: ['mise à jour taux (comptable/admin)']
    }
  });
});

export default router;