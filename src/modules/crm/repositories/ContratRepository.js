import { db } from '../../../core/database/connection.js';

export class ContratRepository {
  
  async findAll() {
    try {
      return await db('contrats')
        .leftJoin('tiers', 'contrats.tiers_id', 'tiers.id_tiers')
        .select(
          'contrats.*',
          'tiers.nom as client_nom',
          'tiers.email as client_email'
        )
        .orderBy('contrats.created_at', 'desc');
    } catch (error) {
      console.error('Erreur ContratRepository.findAll:', error);
      throw new Error('Erreur lors de la récupération des contrats');
    }
  }

  async findById(id_contrat) {
    try {
      const contrat = await db('contrats')
        .leftJoin('tiers', 'contrats.tiers_id', 'tiers.id_tiers')
        .select(
          'contrats.*',
          'tiers.nom as client_nom',
          'tiers.email as client_email',
          'tiers.telephone as client_telephone'
        )
        .where('contrats.id_contrat', id_contrat)
        .first();
      
      if (contrat) {
        return {
          ...contrat,
          client: {
            id: contrat.tiers_id,
            nom: contrat.client_nom,
            email: contrat.client_email,
            telephone: contrat.client_telephone
          }
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erreur ContratRepository.findById:', error);
      throw new Error('Erreur lors de la récupération du contrat');
    }
  }

  async findByClient(tiers_id) {
    try {
      const contrats = await db('contrats')
        .leftJoin('tiers', 'contrats.tiers_id', 'tiers.id_tiers')
        .select(
          'contrats.*',
          'tiers.nom as client_nom',
          'tiers.email as client_email'
        )
        .where('contrats.tiers_id', tiers_id)
        .orderBy('contrats.date_debut', 'desc');
      
      return contrats.map(contrat => ({
        ...contrat,
        client: {
          id: contrat.tiers_id,
          nom: contrat.client_nom,
          email: contrat.client_email
        }
      }));
    } catch (error) {
      console.error('Erreur ContratRepository.findByClient:', error);
      throw new Error('Erreur lors de la récupération des contrats du client');
    }
  }

  async create(contratData) {
    try {
      const [id_contrat] = await db('contrats').insert(contratData);
      return await this.findById(id_contrat);
    } catch (error) {
      console.error('Erreur ContratRepository.create:', error);
      throw new Error('Erreur lors de la création du contrat');
    }
  }

  async update(id_contrat, contratData) {
    try {
      await db('contrats')
        .where('id_contrat', id_contrat)
        .update({
          ...contratData,
          updated_at: new Date()
        });
      
      return await this.findById(id_contrat);
    } catch (error) {
      console.error('Erreur ContratRepository.update:', error);
      throw new Error('Erreur lors de la mise à jour du contrat');
    }
  }

  async updateStatut(id_contrat, statut) {
    try {
      await db('contrats')
        .where('id_contrat', id_contrat)
        .update({
          statut,
          updated_at: new Date()
        });
      
      return await this.findById(id_contrat);
    } catch (error) {
      console.error('Erreur ContratRepository.updateStatut:', error);
      throw new Error('Erreur lors de la mise à jour du statut du contrat');
    }
  }

  async findLast() {
    try {
      return await db('contrats')
        .orderBy('id_contrat', 'desc')
        .first();
    } catch (error) {
      console.error('Erreur ContratRepository.findLast:', error);
      throw error;
    }
  }

  async getStats() {
    try {
      const stats = await db('contrats')
        .select('statut')
        .count('* as count')
        .groupBy('statut');
      
      const totalMontant = await db('contrats')
        .where('statut', 'actif')
        .sum('montant_ht as total_ca')
        .first();
      
      return {
        par_statut: stats,
        total_chiffre_affaires: totalMontant.total_ca || 0
      };
    } catch (error) {
      console.error('Erreur ContratRepository.getStats:', error);
      throw new Error('Erreur lors du calcul des statistiques des contrats');
    }
  }

  // Dans ContratRepository.js - AJOUTER :
async findByDevisId(devis_id) {
  try {
    return await db('contrats')
      .where('devis_id', devis_id)
      .first();
  } catch (error) {
    console.error('Erreur ContratRepository.findByDevisId:', error);
    throw error;
  }
}
}

export default ContratRepository;