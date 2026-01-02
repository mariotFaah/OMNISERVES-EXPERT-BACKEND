import { ActiviteRepository } from '../repositories/ActiviteRepository.js';

export class ActiviteService {
  constructor() {
    this.activiteRepository = new ActiviteRepository();
  }

  async createActivite(activiteData) {
    try {
      // Validation des données requises
      if (!activiteData.tiers_id || !activiteData.type_activite || !activiteData.sujet || !activiteData.date_activite) {
        throw new Error('Le client, le type, le sujet et la date sont obligatoires');
      }

      return await this.activiteRepository.create(activiteData);
    } catch (error) {
      console.error('Erreur ActiviteService.createActivite:', error);
      throw new Error(`Erreur lors de la création de l activité: ${error.message}`);
    }
  }

  async getActivitesByClient(tiers_id) {
    try {
      return await this.activiteRepository.findByClient(tiers_id);
    } catch (error) {
      console.error('Erreur ActiviteService.getActivitesByClient:', error);
      throw new Error('Erreur lors de la récupération des activités du client');
    }
  }

  async getAllActivites() {
    try {
      return await this.activiteRepository.findAll();
    } catch (error) {
      console.error('Erreur ActiviteService.getAllActivites:', error);
      throw new Error('Erreur lors de la récupération des activités');
    }
  }
}

export default ActiviteService;