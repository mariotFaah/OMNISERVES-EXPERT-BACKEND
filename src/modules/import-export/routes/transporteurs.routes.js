import { Router } from 'express';
import TransporteurController from '../controllers/TransporteurController.js';

const router = Router();
const transporteurController = new TransporteurController();

// GET /api/transporteurs - Liste tous les transporteurs
router.get('/', transporteurController.getAll);

// GET /api/transporteurs/search - Recherche de transporteurs
router.get('/search', transporteurController.search);

// GET /api/transporteurs/type/:type - Transporteurs par type
router.get('/type/:type', transporteurController.getByType);

// GET /api/transporteurs/:id - Détail d'un transporteur
router.get('/:id', transporteurController.getById);

// POST /api/transporteurs - Créer un transporteur
router.post('/', transporteurController.create);

// PUT /api/transporteurs/:id - Modifier un transporteur
router.put('/:id', transporteurController.update);

// DELETE /api/transporteurs/:id - Supprimer un transporteur
router.delete('/:id', transporteurController.delete);

export default router;