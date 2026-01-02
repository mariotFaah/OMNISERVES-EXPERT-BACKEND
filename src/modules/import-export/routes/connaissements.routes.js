import { Router } from 'express';
import ConnaissementController from '../controllers/ConnaissementController.js';

const router = Router();
const connaissementController = new ConnaissementController();

// GET /api/connaissements - Liste tous les connaissements
router.get('/', connaissementController.getAll);

// GET /api/connaissements/statut/:statut - Connaissements par statut
router.get('/statut/:statut', connaissementController.getByStatut);

// GET /api/connaissements/expedition/:expeditionId - Connaissement d'une expédition
router.get('/expedition/:expeditionId', connaissementController.getByExpedition);

// GET /api/connaissements/numero/:numero - Connaissement par numéro
router.get('/numero/:numero', connaissementController.getByNumero);

// GET /api/connaissements/:id - Détail d'un connaissement
router.get('/:id', connaissementController.getById);

// POST /api/connaissements - Créer un connaissement
router.post('/', connaissementController.create);

// PUT /api/connaissements/:id - Modifier un connaissement
router.put('/:id', connaissementController.update);

// PATCH /api/connaissements/:id/statut - Modifier le statut
router.patch('/:id/statut', connaissementController.updateStatut);

// DELETE /api/connaissements/:id - Supprimer un connaissement
router.delete('/:id', connaissementController.delete);

export default router;