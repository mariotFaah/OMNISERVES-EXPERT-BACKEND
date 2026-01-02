import { TiersRepository } from '../repositories/TiersRepository.js';

export class TiersService {
  constructor() {
    this.tiersRepository = new TiersRepository();
  }

  // Récupérer tous les tiers
  async getTiers() {
    try {
      return await this.tiersRepository.findAll();
    } catch (error) {
      console.error('Erreur TiersService.getTiers:', error);
      throw new Error('Erreur lors de la récupération des tiers');
    }
  }

  // Récupérer un tiers par ID
  async getTiersById(id_tiers) {
    try {
      const tiers = await this.tiersRepository.findById(id_tiers);
      
      if (!tiers) {
        throw new Error('Tiers non trouvé');
      }

      return tiers;
    } catch (error) {
      console.error('Erreur TiersService.getTiersById:', error);
      throw new Error(`Erreur lors de la récupération du tiers: ${error.message}`);
    }
  }

  // Créer un nouveau tiers
  async createTiers(tiersData) {
    try {
      // Vérifier si le numéro existe déjà
      if (tiersData.numero) {
        const numeroExists = await this.tiersRepository.numeroExists(tiersData.numero);
        if (numeroExists) {
          throw new Error('Un tiers avec ce numéro existe déjà');
        }
      }

      return await this.tiersRepository.create(tiersData);
    } catch (error) {
      console.error('Erreur TiersService.createTiers:', error);
      throw new Error(`Erreur lors de la création du tiers: ${error.message}`);
    }
  }

  // Mettre à jour un tiers
  async updateTiers(id_tiers, tiersData) {
    try {
      // Vérifier que le tiers existe
      const existingTiers = await this.tiersRepository.findById(id_tiers);
      if (!existingTiers) {
        throw new Error('Tiers non trouvé');
      }

      // Vérifier si le numéro existe déjà (pour un autre tiers)
      if (tiersData.numero && tiersData.numero !== existingTiers.numero) {
        const numeroExists = await this.tiersRepository.numeroExists(tiersData.numero, id_tiers);
        if (numeroExists) {
          throw new Error('Un autre tiers avec ce numéro existe déjà');
        }
      }

      return await this.tiersRepository.update(id_tiers, tiersData);
    } catch (error) {
      console.error('Erreur TiersService.updateTiers:', error);
      throw new Error(`Erreur lors de la mise à jour du tiers: ${error.message}`);
    }
  }

  // Supprimer un tiers
  async deleteTiers(id_tiers) {
    try {
      const tiers = await this.tiersRepository.findById(id_tiers);
      
      if (!tiers) {
        throw new Error('Tiers non trouvé');
      }

      return await this.tiersRepository.delete(id_tiers);
    } catch (error) {
      console.error('Erreur TiersService.deleteTiers:', error);
      throw new Error(`Erreur lors de la suppression du tiers: ${error.message}`);
    }
  }
}

export default TiersService;