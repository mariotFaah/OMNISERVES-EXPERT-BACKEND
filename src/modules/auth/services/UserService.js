import UserRepository from '../repositories/UserRepository.js';
import bcrypt from 'bcryptjs';

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers() {
    return await this.userRepository.findAllWithRoles();
  }

  async createUser(userData) {
    // Validation des données
    if (!userData.email || !userData.password) {
      throw new Error('Email et mot de passe requis');
    }

    // Vérifier si l'email existe déjà
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Trouver l'ID du rôle
    const roleId = await this.getRoleId(userData.role);
    if (!roleId) {
      throw new Error('Rôle invalide');
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const userToCreate = {
      email: userData.email,
      password_hash: hashedPassword,
      nom: userData.nom,
      prenom: userData.prenom,
      id_role: roleId,
      is_active: true
    };

    const [userId] = await this.userRepository.createUser(userToCreate);
    
    // Retourner l'utilisateur créé
    return await this.userRepository.findByIdWithRole(userId);
  }

  async updateUser(id, userData) {
    // Vérifier que l'utilisateur existe
    const existingUser = await this.userRepository.findByIdWithRole(id);
    if (!existingUser) {
      throw new Error('Utilisateur non trouvé');
    }

    const updateData = {
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email
    };

    // Si le rôle est fourni, le mettre à jour
    if (userData.role) {
      const roleId = await this.getRoleId(userData.role);
      if (!roleId) {
        throw new Error('Rôle invalide');
      }
      updateData.id_role = roleId;
    }

    // Si le mot de passe est fourni, le hasher
    if (userData.password) {
      updateData.password_hash = await bcrypt.hash(userData.password, 12);
    }

    await this.userRepository.update(id, updateData);
    
    // Retourner l'utilisateur mis à jour
    return await this.userRepository.findByIdWithRole(id);
  }

  async deactivateUser(id) {
    const existingUser = await this.userRepository.findByIdWithRole(id);
    if (!existingUser) {
      throw new Error('Utilisateur non trouvé');
    }

    return await this.userRepository.update(id, { is_active: false });
  }

  async activateUser(id) {
    const existingUser = await this.userRepository.findByIdWithRole(id);
    if (!existingUser) {
      throw new Error('Utilisateur non trouvé');
    }

    return await this.userRepository.update(id, { is_active: true });
  }

  // Méthode utilitaire pour obtenir l'ID d'un rôle
  async getRoleId(roleCode) {
    const role = await this.userRepository.db
      .select('id_role')
      .from('roles')
      .where('code_role', roleCode)
      .first();
    
    return role ? role.id_role : null;
  }
}