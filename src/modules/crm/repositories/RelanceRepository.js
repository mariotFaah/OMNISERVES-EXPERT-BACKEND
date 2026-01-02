import connection from '../../../core/database/connection.js';
import { Relance } from '../entities/Relance.js';

export class RelanceRepository {
  constructor() {
    this.db = connection;
    this.tableName = 'relances';
    this.idColumn = 'id_relance';
  }

  async findAllWithDetails() {
    try {
      const relances = await this.db(this.tableName)
        .select(
          'r.*',
          't.nom as client_nom',
          'f.numero_facture',
          'c.numero_contrat'
        )
        .from('relances as r')
        .leftJoin('tiers as t', 'r.tiers_id', 't.id_tiers')
        .leftJoin('factures as f', 'r.facture_id', 'f.numero_facture')
        .leftJoin('contrats as c', 'r.contrat_id', 'c.id_contrat')
        .orderBy('r.date_relance', 'desc');

      return relances.map(relance => new Relance(relance));
    } catch (error) {
      console.error('Erreur RelanceRepository.findAllWithDetails:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const relance = await this.db(this.tableName)
        .where(this.idColumn, id)
        .first();
      
      return relance ? new Relance(relance) : null;
    } catch (error) {
      console.error('Erreur RelanceRepository.findById:', error);
      throw error;
    }
  }

  async findByClient(tiers_id) {
    try {
      const relances = await this.db(this.tableName)
        .where('tiers_id', tiers_id)
        .orderBy('date_relance', 'desc');

      return relances.map(relance => new Relance(relance));
    } catch (error) {
      console.error('Erreur RelanceRepository.findByClient:', error);
      throw error;
    }
  }

  async findByStatut(statut) {
    try {
      const relances = await this.db(this.tableName)
        .where('statut', statut)
        .orderBy('date_relance', 'desc');

      return relances.map(relance => new Relance(relance));
    } catch (error) {
      console.error('Erreur RelanceRepository.findByStatut:', error);
      throw error;
    }
  }

  async findEnAttente() {
    return this.findByStatut('en_attente');
  }

  async create(relanceData) {
    try {
      const [id] = await this.db(this.tableName)
        .insert({
          ...relanceData,
          created_at: new Date(),
          updated_at: new Date()
        });

      return await this.findById(id);
    } catch (error) {
      console.error('Erreur RelanceRepository.create:', error);
      throw error;
    }
  }

  async updateStatut(id_relance, statut) {
    try {
      await this.db(this.tableName)
        .where(this.idColumn, id_relance)
        .update({
          statut,
          updated_at: new Date()
        });

      return await this.findById(id_relance);
    } catch (error) {
      console.error('Erreur RelanceRepository.updateStatut:', error);
      throw error;
    }
  }
}

export default RelanceRepository;
