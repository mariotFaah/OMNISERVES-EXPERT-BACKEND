import { db } from '../../../core/database/connection.js';

export class PlanComptableRepository {
  async findAll() {
    return db('plan_comptable').where('actif', true).orderBy('numero_compte');
  }

    async findByNumero(numero_compte) {
      return db('plan_comptable')
        .where('numero_compte', numero_compte)
        .first();
    }

  async findByCategorie(categorie) {
    return db('plan_comptable').where({ categorie, actif: true }).first();
  }

  async create(data) {
    const [numero_compte] = await db('plan_comptable').insert(data);
    return this.findByNumero(numero_compte);
  }

  async update(numero_compte, data) {
    await db('plan_comptable').where({ numero_compte }).update(data);
    return this.findByNumero(numero_compte);
  }
}