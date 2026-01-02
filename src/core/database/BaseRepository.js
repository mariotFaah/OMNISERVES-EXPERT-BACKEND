import { db } from './connection.js';

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
  }

  query() {
    return this.db(this.tableName);
  }

  async findAll(options = {}) {
    try {
      let query = this.query().select('*');
      
      // Gestion pagination
      if (options.page && options.limit) {
        const offset = (options.page - 1) * options.limit;
        query = query.offset(offset).limit(options.limit);
      }
      
      return await query;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('ID invalide');
      }
      
      const result = await this.query().where('id', id).first();
      
      if (!result) {
        throw new Error(`${this.tableName} avec ID ${id} non trouvé`);
      }
      
      return result;
    } catch (error) {
      throw new Error(`Erreur findById: ${error.message}`);
    }
  }

  async create(data) {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('Données invalides pour la création');
      }

      const [id] = await this.query().insert({
        ...data,
        created_at: this.db.fn.now(),
        updated_at: this.db.fn.now()
      });
      
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Erreur création: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      await this.findById(id); 
      
      const updated = await this.query()
        .where('id', id)
        .update({
          ...data,
          updated_at: this.db.fn.now()
        })
        .returning('*'); 
      
      return updated[0];
    } catch (error) {
      throw new Error(`Erreur mise à jour: ${error.message}`);
    }
  }


  async delete(id) {
    try {
      const exists = await this.findById(id);
      const result = await this.query().where('id', id).del();
      
      return { deleted: true, affectedRows: result };
    } catch (error) {
      throw new Error(`Erreur suppression: ${error.message}`);
    }
  }
}

export default BaseRepository;
