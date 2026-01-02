import BaseRepository from '../../../core/database/BaseRepository.js';
import Connaissement from '../entities/Connaissement.js';

class ConnaissementRepository extends BaseRepository {
  constructor() {
    super('connaissements');
    this.EntityClass = Connaissement;
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

  async findByExpedition(expeditionId) {
    const result = await this.query()
      .where('expedition_id', expeditionId)
      .join('transporteurs', 'connaissements.transporteur_id', 'transporteurs.id')
      .select(
        'connaissements.*',
        'transporteurs.nom as transporteur_nom',
        'transporteurs.type_transport as transporteur_type'
      )
      .first();
    return result ? new this.EntityClass(result) : null;
  }

  async findByNumero(numero) {
  try {
    const result = await this.query()
      .where('connaissements.numero_connaissement', numero)
      .join('transporteurs', 'connaissements.transporteur_id', 'transporteurs.id')
      .join('expeditions', 'connaissements.expedition_id', 'expeditions.id')
      .join('commandes', 'expeditions.commande_id', 'commandes.id')
      .select(
        'connaissements.*',
        'transporteurs.nom as transporteur_nom',
        'transporteurs.type_transport as transporteur_type',
        'expeditions.numero_bl',
        'expeditions.date_expedition',
        'commandes.numero_commande',
        'commandes.type as commande_type'
      )
      .first();
    
    return result ? new this.EntityClass(result) : null;
  } catch (error) {
    console.error('Erreur ConnaissementRepository.findByNumero:', error);
    throw error;
  }
}

  async findByStatut(statut) {
    const results = await this.query()
      .where('statut', statut)
      .join('transporteurs', 'connaissements.transporteur_id', 'transporteurs.id')
      .join('expeditions', 'connaissements.expedition_id', 'expeditions.id')
      .select(
        'connaissements.*',
        'transporteurs.nom as transporteur_nom',
        'expeditions.numero_bl'
      )
      .orderBy('connaissements.date_emission', 'desc');
    return results.map(row => new this.EntityClass(row));
  }

  async getNextNumeroConnaissement() {
    const lastConnaissement = await this.query()
      .where('numero_connaissement', 'like', 'CON-%')
      .orderBy('id', 'desc')
      .first();

    let nextNumber = 1;
    if (lastConnaissement && lastConnaissement.numero_connaissement) {
      const lastNumber = parseInt(lastConnaissement.numero_connaissement.replace('CON-', ''));
      nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1;
    }

    return `CON-${nextNumber.toString().padStart(6, '0')}`;
  }
}

export default ConnaissementRepository;