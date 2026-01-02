// src/modules/auth/controllers/AuthController.js
import { AuthService } from '../services/AuthService.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      
      res.json({
        success: true,
        message: 'Connexion réussie',
        data: result
      });
    } catch (error) {
      console.error('Erreur AuthController.login:', error);
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }
}