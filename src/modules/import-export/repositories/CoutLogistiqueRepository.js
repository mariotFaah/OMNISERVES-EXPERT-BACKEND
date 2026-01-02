import BaseRepository from '../../../core/database/BaseRepository.js';
import CoutLogistique from '../entities/CoutLogistique.js';

class CoutLogistiqueRepository extends BaseRepository {
  constructor() {
    super('couts_logistiques');
  }

  async findByCommandeId(commandeId) {
    const couts = await this.db
      .select('*')
      .from('couts_logistiques')
      .where('commande_id', commandeId)
      .first();

    return couts ? new CoutLogistique(couts) : null;
  }

  async createOrUpdate(coutsData) {
    const existing = await this.findByCommandeId(coutsData.commande_id);
    
    if (existing) {
      return await this.update(existing.id, coutsData);
    } else {
      return await this.create(coutsData);
    }
  }
}

export default CoutLogistiqueRepository;
