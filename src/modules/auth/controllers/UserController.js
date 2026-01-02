import { UserService } from '../services/UserService.js';

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  // Liste tous les utilisateurs
  getAllUsers = async (req, res) => {
    try {
      const users = await this.userService.getAllUsers();
      res.json({
        success: true,
        message: 'Utilisateurs récupérés avec succès',
        data: users
      });
    } catch (error) {
      console.error('Erreur UserController.getAllUsers:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs'
      });
    }
  };

  // Créer un utilisateur
  createUser = async (req, res) => {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);
      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: user
      });
    } catch (error) {
      console.error('Erreur UserController.createUser:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Mettre à jour un utilisateur
  updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await this.userService.updateUser(id, userData);
      res.json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: user
      });
    } catch (error) {
      console.error('Erreur UserController.updateUser:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Désactiver un utilisateur
  deactivateUser = async (req, res) => {
    try {
      const { id } = req.params;
      await this.userService.deactivateUser(id);
      res.json({
        success: true,
        message: 'Utilisateur désactivé avec succès'
      });
    } catch (error) {
      console.error('Erreur UserController.deactivateUser:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Réactiver un utilisateur
  activateUser = async (req, res) => {
    try {
      const { id } = req.params;
      await this.userService.activateUser(id);
      res.json({
        success: true,
        message: 'Utilisateur réactivé avec succès'
      });
    } catch (error) {
      console.error('Erreur UserController.activateUser:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
}