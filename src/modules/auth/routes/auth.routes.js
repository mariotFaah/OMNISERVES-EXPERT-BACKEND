// src/modules/auth/routes/auth.routes.js
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { validateRequest } from '../../../core/middleware/validation.js';
import { loginSchema } from '../validators/auth.validator.js';

// ✅ NOUVEAU : Plus besoin d'importer l'ancien authMiddleware

const router = Router();
const authController = new AuthController();

// Route de connexion
router.post('/login', 
  validateRequest(loginSchema), 
  authController.login.bind(authController)
);

// Route de déconnexion (optionnelle)
router.post('/logout', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Déconnexion réussie' 
  });
});

// Route de vérification de token (optionnelle)
router.get('/verify', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Endpoint de vérification - à implémenter' 
  });
});

// Route racine
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Module d\'authentification Aquatiko',
    endpoints: {
      login: 'POST /api/auth/login',
      logout: 'POST /api/auth/logout',
      verify: 'GET /api/auth/verify'
    }
  });
});

export default router;