// src/modules/import-export/routes/commandes.routes.js
import express from 'express';
import CommandeController from '../controllers/CommandeController.js';
// ✅ AJOUT : Importer le middleware (optionnel - déjà protégé au niveau supérieur)
// import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = express.Router();
const commandeController = new CommandeController();

// Routes pour les commandes - DÉJÀ PROTÉGÉES PAR LE MIDDLEWARE SUPÉRIEUR
router.get('/', commandeController.getAll);
router.get('/:id', commandeController.getById);
router.post('/', commandeController.create);
router.patch('/:id/statut', commandeController.updateStatut);

// Routes pour l'expédition
router.post('/expedition', commandeController.updateExpedition);

// Routes pour les coûts logistiques
router.post('/couts', commandeController.updateCouts);

// Routes pour le calcul de marge
router.get('/:id/marge', commandeController.calculerMarge);

export default router;