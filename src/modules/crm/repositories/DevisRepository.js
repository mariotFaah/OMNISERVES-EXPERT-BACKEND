import { db } from '../../../core/database/connection.js';
import { Devis } from '../entities/Devis.js';

export class DevisRepository {
  
  async findById(id_devis) {
    try {
      const devis = await db('devis')
        .leftJoin('tiers', 'devis.tiers_id', 'tiers.id_tiers')
        .select(
          'devis.*',
          'tiers.nom as client_nom',
          'tiers.email as client_email',
          'tiers.telephone as client_telephone'
        )
        .where('devis.id_devis', id_devis)
        .first();
      
      // Formater la réponse pour inclure les infos client
      if (devis) {
        return {
          ...devis,
          client: {
            id: devis.tiers_id,
            nom: devis.client_nom,
            email: devis.client_email,
            telephone: devis.client_telephone
          }
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erreur DevisRepository.findById:', error);
      throw new Error('Erreur lors de la récupération du devis');
    }
  }

  async findAll() {
    try {
      const devis = await db('devis')
        .leftJoin('tiers', 'devis.tiers_id', 'tiers.id_tiers')
        .select(
          'devis.*',
          'tiers.nom as client_nom',
          'tiers.email as client_email'
        )
        .orderBy('devis.created_at', 'desc');
      
      return devis.map(devis => ({
        ...devis,
        client: {
          id: devis.tiers_id,
          nom: devis.client_nom,
          email: devis.client_email
        }
      }));
    } catch (error) {
      console.error('Erreur DevisRepository.findAll:', error);
      throw new Error('Erreur lors de la récupération des devis');
    }
  }

  async findByClient(tiers_id) {
    try {
      const devis = await db('devis')
        .leftJoin('tiers', 'devis.tiers_id', 'tiers.id_tiers')
        .select(
          'devis.*',
          'tiers.nom as client_nom',
          'tiers.email as client_email'
        )
        .where('devis.tiers_id', tiers_id)
        .orderBy('devis.date_devis', 'desc');
      
      return devis.map(devis => ({
        ...devis,
        client: {
          id: devis.tiers_id,
          nom: devis.client_nom,
          email: devis.client_email
        }
      }));
    } catch (error) {
      console.error('Erreur DevisRepository.findByClient:', error);
      throw new Error('Erreur lors de la récupération des devis du client');
    }
  }

  async create(devisData) {
    try {
      // Générer le numéro de devis automatique
      const count = await db('devis').count('* as total').first();
      const numero = `DEV-${String(parseInt(count.total) + 1).padStart(6, '0')}`;
      
      const devisComplet = {
        ...devisData,
        numero_devis: numero
      };

      const [id_devis] = await db('devis').insert(devisComplet);
      
      return await this.findById(id_devis);
    } catch (error) {
      console.error('Erreur DevisRepository.create:', error);
      throw new Error('Erreur lors de la création du devis');
    }
  }

  async update(id_devis, devisData) {
    try {
      await db('devis')
        .where('id_devis', id_devis)
        .update({
          ...devisData,
          updated_at: new Date()
        });
      
      return await this.findById(id_devis);
    } catch (error) {
      console.error('Erreur DevisRepository.update:', error);
      throw new Error('Erreur lors de la mise à jour du devis');
    }
  }

  async updateStatut(id_devis, statut) {
    try {
      await db('devis')
        .where('id_devis', id_devis)
        .update({
          statut,
          updated_at: new Date()
        });
      
      return await this.findById(id_devis);
    } catch (error) {
      console.error('Erreur DevisRepository.updateStatut:', error);
      throw new Error('Erreur lors de la mise à jour du statut du devis');
    }
  }

  async getStats() {
    try {
      const stats = await db('devis')
        .select('statut')
        .count('* as count')
        .groupBy('statut');
      
      const totalMontant = await db('devis')
        .where('statut', 'accepte')
        .sum('montant_ttc as total_ca')
        .first();
      
      return {
        par_statut: stats,
        total_chiffre_affaires: totalMontant.total_ca || 0
      };
    } catch (error) {
      console.error('Erreur DevisRepository.getStats:', error);
      throw new Error('Erreur lors du calcul des statistiques des devis');
    }
  }

  async findLast() {
    try {
      return await db('devis')
        .orderBy('id_devis', 'desc')
        .first();
    } catch (error) {
      console.error('Erreur DevisRepository.findLast:', error);
      throw error;
    }
  }
}

export default DevisRepository;