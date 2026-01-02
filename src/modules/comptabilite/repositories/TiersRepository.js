import { db } from '../../../core/database/connection.js';

export class TiersRepository {
  
  async findAll() {
    try {
      const tiers = await db('tiers')
        .select('*')
        .orderBy('nom', 'asc');
      
      return tiers;
    } catch (error) {
      console.error('Erreur TiersRepository.findAll:', error);
      throw new Error('Erreur lors de la récupération des tiers');
    }
  }

  async findById(id_tiers) {
    try {
      const tiers = await db('tiers')
        .where('id_tiers', id_tiers)
        .first();
      
      return tiers;
    } catch (error) {
      console.error('Erreur TiersRepository.findById:', error);
      throw new Error('Erreur lors de la récupération du tiers');
    }
  }

  async create(tiersData) {
    try {
      const [id_tiers] = await db('tiers').insert(tiersData);
      
      const nouveauTiers = await this.findById(id_tiers);
      return nouveauTiers;
    } catch (error) {
      console.error('Erreur TiersRepository.create:', error);
      throw new Error('Erreur lors de la création du tiers');
    }
  }

  async update(id_tiers, tiersData) {
    try {
      await db('tiers')
        .where('id_tiers', id_tiers)
        .update({
          ...tiersData,
          updated_at: new Date()
        });
      
      const tiersMaj = await this.findById(id_tiers);
      return tiersMaj;
    } catch (error) {
      console.error('Erreur TiersRepository.update:', error);
      throw new Error('Erreur lors de la mise à jour du tiers');
    }
  }

  async delete(id_tiers) {
    try {
      await db('tiers')
        .where('id_tiers', id_tiers)
        .delete();
      
      return { message: 'Tiers supprimé avec succès' };
    } catch (error) {
      console.error('Erreur TiersRepository.delete:', error);
      throw new Error('Erreur lors de la suppression du tiers');
    }
  }

  // Vérifier si un numéro existe déjà
  async numeroExists(numero, excludeId = null) {
    try {
      let query = db('tiers').where('numero', numero);
      
      if (excludeId) {
        query = query.whereNot('id_tiers', excludeId);
      }
      
      const exists = await query.first();
      return !!exists;
    } catch (error) {
      console.error('Erreur TiersRepository.numeroExists:', error);
      throw error;
    }
  }

  async findByDevisePreferee(devise) {
    try {
      const tiers = await db('tiers')
        .where('devise_preferee', devise)
        .andWhere('actif', true)
        .select('*');
      
      return tiers;
    } catch (error) {
      console.error('Erreur TiersRepository.findByDevisePreferee:', error);
      throw new Error('Erreur lors de la récupération des tiers par devise préférée');
    }
  }
}

export default TiersRepository;