import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../../core/database/connection.js';

export class AuthService {
  async login(email, password) {
    // ✅ CORRECTION : Faire la jointure avec la table roles
    const user = await db('users')
      .select(
        'users.*',
        'roles.code_role',
        'roles.nom_role'
      )
      .leftJoin('roles', 'users.id_role', 'roles.id_role')
      .where('users.email', email)
      .where('users.is_active', true)
      .first();

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // ✅ CORRECTION : Utiliser user.code_role pour le token
    const token = jwt.sign(
      {
        userId: user.id_user,
        email: user.email,
        nom: user.nom,
        role: user.code_role // ← Maintenant ça fonctionnera
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ CORRECTION : Retourner aussi le rôle dans la réponse user
    return { 
      user: { 
        id: user.id_user,
        email: user.email,
        nom: user.nom,
        role: user.code_role // ← Ici aussi
      }, 
      token 
    };
  }
}