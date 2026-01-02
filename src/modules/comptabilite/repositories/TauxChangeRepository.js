import { db } from '../../../core/database/connection.js';

export class TauxChangeRepository {
  
  // Récupérer le taux de change actuel
  async getTauxActuel(devise_source, devise_cible) {
    try {
      const taux = await db('taux_change')
        .where('devise_source', devise_source)
        .andWhere('devise_cible', devise_cible)
        .andWhere('actif', true)
        .orderBy('date_effet', 'desc')
        .first();
      
      return taux;
    } catch (error) {
      console.error('Erreur TauxChangeRepository.getTauxActuel:', error);
      throw new Error('Erreur lors de la récupération du taux de change');
    }
  }

  // Récupérer le taux de change à une date spécifique
  async getTauxByDate(devise_source, devise_cible, date) {
    try {
      const taux = await db('taux_change')
        .where('devise_source', devise_source)
        .andWhere('devise_cible', devise_cible)
        .andWhere('date_effet', '<=', date)
        .orderBy('date_effet', 'desc')
        .first();
      
      return taux;
    } catch (error) {
      console.error('Erreur TauxChangeRepository.getTauxByDate:', error);
      throw new Error('Erreur lors de la récupération du taux de change historique');
    }
  }

  // Créer un nouveau taux de change
  async create(tauxData) {
    try {
      const [id_taux] = await db('taux_change').insert(tauxData);
      
      const nouveauTaux = await db('taux_change')
        .where('id_taux', id_taux)
        .first();
      
      return nouveauTaux;
    } catch (error) {
      console.error('Erreur TauxChangeRepository.create:', error);
      throw new Error('Erreur lors de la création du taux de change');
    }
  }

  // Désactiver les anciens taux
  async desactiverAnciensTaux(devise_source, devise_cible) {
    try {
      await db('taux_change')
        .where('devise_source', devise_source)
        .andWhere('devise_cible', devise_cible)
        .andWhere('actif', true)
        .update({ actif: false });
      
      return { message: 'Anciens taux désactivés avec succès' };
    } catch (error) {
      console.error('Erreur TauxChangeRepository.desactiverAnciensTaux:', error);
      throw new Error('Erreur lors de la désactivation des anciens taux');
    }
  }

  // Récupérer tous les taux actifs
  async findAllActifs() {
    try {
      const taux = await db('taux_change')
        .where('actif', true)
        .orderBy('devise_source', 'asc')
        .orderBy('devise_cible', 'asc');
      
      return taux;
    } catch (error) {
      console.error('Erreur TauxChangeRepository.findAllActifs:', error);
      throw new Error('Erreur lors de la récupération des taux actifs');
    }
  }
}

export default TauxChangeRepository;