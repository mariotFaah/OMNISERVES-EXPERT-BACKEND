// backend/src/modules/auth/routes/users.routes.js
import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { auth } from '../../../core/middleware/auth.js'; // ← CHANGER ICI
import { authorize } from '../middleware/authorize.js';

const router = express.Router();
const userController = new UserController();

// Toutes les routes nécessitent une authentification
router.use(auth); // ← CHANGER ICI

// Seuls les admins peuvent gérer les utilisateurs
router.get('/', authorize('admin'), userController.getAllUsers);
router.post('/', authorize('admin'), userController.createUser);
router.put('/:id', authorize('admin'), userController.updateUser);
router.patch('/:id/deactivate', authorize('admin'), userController.deactivateUser);
router.patch('/:id/activate', authorize('admin'), userController.activateUser);

export default router;