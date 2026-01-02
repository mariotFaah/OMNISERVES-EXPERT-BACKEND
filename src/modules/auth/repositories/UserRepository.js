// backend/src/modules/auth/repositories/UserRepository.js
import BaseRepository from '../../../core/database/BaseRepository.js';

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

async findByEmail(email) {
  return this.db
    .select(
      'users.*',
      'roles.code_role',
      'roles.nom_role',
      'roles.description as role_description'
    )
    .from('users')
    .leftJoin('roles', 'users.id_role', 'roles.id_role')
    .where('users.email', email)
    .where('users.is_active', true) // ← CHANGER 'actif' en 'is_active'
    .first();
}

  async findAllWithRoles() {
    return await this.db
      .select(
        'users.id_user as id',
        'users.email',
        'users.nom',
        'users.prenom',
        'users.is_active',
        'users.last_login',
        'users.created_at',
        'roles.code_role as role',
        'roles.nom_role as nom_role'
      )
      .from('users')
      .leftJoin('roles', 'users.id_role', 'roles.id_role')
      .orderBy('users.created_at', 'desc');
  }


async findByIdWithRole(userId) {
  return this.db
    .select(
      'users.*',
      'roles.code_role',
      'roles.nom_role',
      'roles.description as role_description'
    )
    .from('users')
    .leftJoin('roles', 'users.id_role', 'roles.id_role')
    .where('users.id_user', userId)
    .where('users.is_active', true)
    .first();
}

  async hasPermission(userId, module, action) {
    const result = await this.db
      .count('* as count')
      .from('role_permissions as rp')
      .leftJoin('permissions as p', 'rp.id_permission', 'p.id_permission')
      .leftJoin('users as u', 'rp.id_role', 'u.id_role')
      .where('u.id_user', userId)
      .where('p.module', module)
      .where('p.action', action)
      .first();

    return result.count > 0;
  }

  async updateLastLogin(userId) {
    return this.db('users')
      .where('id_user', userId)
      .update({
        last_login: this.db.fn.now(),
        updated_at: this.db.fn.now()
      });
  }

  // Ajouter cette méthode à votre UserRepository existant
async update(userId, updateData) {
  return this.db('users')
    .where('id_user', userId)
    .update({
      ...updateData,
      updated_at: this.db.fn.now()
    });
}

  async createUser(userData) {
    return this.db('users')
      .insert(userData);
  }
}

export default UserRepository;