import BaseRepository from '../../../core/database/BaseRepository.js';
import Expedition from '../entities/Expedition.js';

class ExpeditionRepository extends BaseRepository {
  constructor() {
    super('expeditions');
  }

  async findByCommandeId(commandeId) {
    const expedition = await this.db
      .select('*')
      .from('expeditions')
      .where('commande_id', commandeId)
      .first();

    return expedition ? new Expedition(expedition) : null;
  }

  async createOrUpdate(expeditionData) {
    const existing = await this.findByCommandeId(expeditionData.commande_id);
    
    if (existing) {
      return await this.update(existing.id, expeditionData);
    } else {
      return await this.create(expeditionData);
    }
  }
}

export default ExpeditionRepository;
