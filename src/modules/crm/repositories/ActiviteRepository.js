import { db } from '../../../core/database/connection.js';

export class ActiviteRepository {
  
  async findAll() {
    try {
      const activites = await db('activites')
        .leftJoin('tiers', 'activites.tiers_id', 'tiers.id_tiers')
        .select(
          'activites.*',
          'tiers.nom as client_nom',
          'tiers.email as client_email'
        )
        .orderBy('activites.date_activite', 'desc');
      
      return activites.map(activite => ({
        ...activite,
        client: {
          id: activite.tiers_id,
          nom: activite.client_nom,
          email: activite.client_email
        }
      }));
    } catch (error) {
      console.error('Erreur ActiviteRepository.findAll:', error);
      throw new Error('Erreur lors de la récupération des activités');
    }
  }

  async findById(id_activite) {
    try {
      const activite = await db('activites')
        .leftJoin('tiers', 'activites.tiers_id', 'tiers.id_tiers')
        .select(
          'activites.*',
          'tiers.nom as client_nom',
          'tiers.email as client_email',
          'tiers.telephone as client_telephone'
        )
        .where('activites.id_activite', id_activite)
        .first();
      
      if (activite) {
        return {
          ...activite,
          client: {
            id: activite.tiers_id,
            nom: activite.client_nom,
            email: activite.client_email,
            telephone: activite.client_telephone
          }
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erreur ActiviteRepository.findById:', error);
      throw new Error('Erreur lors de la récupération de l activité');
    }
  }

  async findByClient(tiers_id) {
    try {
      const activites = await db('activites')
        .leftJoin('tiers', 'activites.tiers_id', 'tiers.id_tiers')
        .select(
          'activites.*',
          'tiers.nom as client_nom',
          'tiers.email as client_email'
        )
        .where('activites.tiers_id', tiers_id)
        .orderBy('activites.date_activite', 'desc');
      
      return activites.map(activite => ({
        ...activite,
        client: {
          id: activite.tiers_id,
          nom: activite.client_nom,
          email: activite.client_email
        }
      }));
    } catch (error) {
      console.error('Erreur ActiviteRepository.findByClient:', error);
      throw new Error('Erreur lors de la récupération des activités du client');
    }
  }

  async create(activiteData) {
    try {
      const [id_activite] = await db('activites').insert(activiteData);
      return await this.findById(id_activite);
    } catch (error) {
      console.error('Erreur ActiviteRepository.create:', error);
      throw new Error('Erreur lors de la création de l activité');
    }
  }

  async update(id_activite, activiteData) {
    try {
      await db('activites')
        .where('id_activite', id_activite)
        .update({
          ...activiteData,
          updated_at: new Date()
        });
      
      return await this.findById(id_activite);
    } catch (error) {
      console.error('Erreur ActiviteRepository.update:', error);
      throw new Error('Erreur lors de la mise à jour de l activité');
    }
  }

  async updateStatut(id_activite, statut) {
    try {
      await db('activites')
        .where('id_activite', id_activite)
        .update({
          statut,
          updated_at: new Date()
        });
      
      return await this.findById(id_activite);
    } catch (error) {
      console.error('Erreur ActiviteRepository.updateStatut:', error);
      throw new Error('Erreur lors de la mise à jour du statut de l activité');
    }
  }
}

export default ActiviteRepository;