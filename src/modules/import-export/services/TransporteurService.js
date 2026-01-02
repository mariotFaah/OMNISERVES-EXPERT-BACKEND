import TransporteurRepository from '../repositories/TransporteurRepository.js';
import Transporteur from '../entities/Transporteur.js';

class TransporteurService {
  constructor() {
    this.transporteurRepo = new TransporteurRepository();
  }

  async getAllTransporteurs() {
    return await this.transporteurRepo.findAllActifs();
  }

  async getTransporteurById(id) {
    return await this.transporteurRepo.findById(id);
  }

  async createTransporteur(transporteurData) {
    // Générer un code transporteur unique
    if (!transporteurData.code_transporteur) {
      const count = await this.transporteurRepo.query().count('id as count').first();
      transporteurData.code_transporteur = `TRP-${(parseInt(count.count) + 1).toString().padStart(4, '0')}`;
    }

    const transporteur = new Transporteur(transporteurData);
    return await this.transporteurRepo.create(transporteur);
  }

  async updateTransporteur(id, transporteurData) {
    const existing = await this.transporteurRepo.findById(id);
    if (!existing) {
      throw new Error('Transporteur non trouvé');
    }

    return await this.transporteurRepo.update(id, transporteurData);
  }

  async deleteTransporteur(id) {
    const existing = await this.transporteurRepo.findById(id);
    if (!existing) {
      throw new Error('Transporteur non trouvé');
    }

    // Désactiver au lieu de supprimer
    return await this.transporteurRepo.update(id, { actif: false });
  }

  async searchTransporteurs(term) {
    return await this.transporteurRepo.searchTransporteurs(term);
  }

  async getTransporteursByType(type) {
    return await this.transporteurRepo.findByType(type);
  }
}

export default TransporteurService;