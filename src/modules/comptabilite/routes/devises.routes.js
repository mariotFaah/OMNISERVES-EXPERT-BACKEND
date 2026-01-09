import express from 'express';
import { DeviseController } from '../controllers/DeviseController.js';
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = express.Router();
const deviseController = new DeviseController();

router.post('/convertir', deviseController.convertir.bind(deviseController));
router.get('/taux', deviseController.getTauxActifs.bind(deviseController));

router.post('/taux', 
  auth,
  requireRole('comptable'),
  deviseController.updateTaux.bind(deviseController)
);

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