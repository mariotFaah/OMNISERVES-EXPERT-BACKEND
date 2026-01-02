import BaseRepository from '../../../core/database/BaseRepository.js';
import Transporteur from '../entities/Transporteur.js';

class TransporteurRepository extends BaseRepository {
  constructor() {
    super('transporteurs');
    this.EntityClass = Transporteur;
  }

  async findAll(options = {}) {
    const results = await super.findAll(options);
    return results.map(row => new this.EntityClass(row));
  }

  async findById(id) {
    const result = await super.findById(id);
    return result ? new this.EntityClass(result) : null;
  }

  async create(data) {
    const result = await super.create(data);
    return new this.EntityClass(result);
  }

  async update(id, data) {
    const result = await super.update(id, data);
    return new this.EntityClass(result);
  }

  async findByType(type) {
    const results = await this.query()
      .where('type_transport', type)
      .andWhere('actif', true)
      .orderBy('nom', 'asc');
    return results.map(row => new this.EntityClass(row));
  }

  async searchTransporteurs(term) {
    const results = await this.query()
      .where('actif', true)
      .andWhere(builder => {
        builder.where('nom', 'like', `%${term}%`)
               .orWhere('code_transporteur', 'like', `%${term}%`)
               .orWhere('contact', 'like', `%${term}%`);
      })
      .orderBy('nom', 'asc');
    return results.map(row => new this.EntityClass(row));
  }

  async findAllActifs() {
    const results = await this.query()
      .where('actif', true)
      .orderBy('nom', 'asc');
    return results.map(row => new this.EntityClass(row));
  }
}

export default TransporteurRepository;