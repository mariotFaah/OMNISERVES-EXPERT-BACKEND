// src/modules/import-export/routes/index.js
import express from 'express';
import commandeRoutes from './commandes.routes.js';
import transporteursRoutes from './transporteurs.routes.js';
import connaissementsRoutes from './connaissements.routes.js';
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = express.Router();

// ✅ PROTECTION GLOBALE POUR TOUTES LES ROUTES IMPORT-EXPORT
router.use(auth);
router.use(requireRole('commercial')); // Commercial et admin (via le middleware)

// Monter les routes des commandes
router.use('/commandes', commandeRoutes);
router.use('/transporteurs', transporteursRoutes);
router.use('/connaissements', connaissementsRoutes);


export default router;
