import ConnaissementRepository from '../repositories/ConnaissementRepository.js';
import TransporteurRepository from '../repositories/TransporteurRepository.js';
import Connaissement from '../entities/Connaissement.js';

class ConnaissementService {
  constructor() {
    this.connaissementRepo = new ConnaissementRepository();
    this.transporteurRepo = new TransporteurRepository();
  }

  async getAllConnaissements() {
    return await this.connaissementRepo.findAll();
  }

  async getConnaissementById(id) {
    return await this.connaissementRepo.findById(id);
  }

  async getConnaissementByExpedition(expeditionId) {
    return await this.connaissementRepo.findByExpedition(expeditionId);
  }

  async getConnaissementByNumero(numero) {
    return await this.connaissementRepo.findByNumero(numero);
  }

  async createConnaissement(connaissementData) {
    // Vérifier le transporteur
    const transporteur = await this.transporteurRepo.findById(connaissementData.transporteur_id);
    if (!transporteur) {
      throw new Error('Transporteur non trouvé');
    }

    // Générer le numéro de connaissement
    if (!connaissementData.numero_connaissement) {
      connaissementData.numero_connaissement = await this.connaissementRepo.getNextNumeroConnaissement();
    }

    return await this.connaissementRepo.create(connaissementData);
  }

  async updateConnaissement(id, connaissementData) {
    const existing = await this.connaissementRepo.findById(id);
    if (!existing) {
      throw new Error('Connaissement non trouvé');
    }

    // Vérifier le transporteur si fourni
    if (connaissementData.transporteur_id) {
      const transporteur = await this.transporteurRepo.findById(connaissementData.transporteur_id);
      if (!transporteur) {
        throw new Error('Transporteur non trouvé');
      }
    }

    return await this.connaissementRepo.update(id, connaissementData);
  }

  async updateStatutConnaissement(id, statut) {
    const existing = await this.connaissementRepo.findById(id);
    if (!existing) {
      throw new Error('Connaissement non trouvé');
    }

    const statutsValides = ['emis', 'embarque', 'arrive', 'livre'];
    if (!statutsValides.includes(statut)) {
      throw new Error('Statut invalide');
    }

    return await this.connaissementRepo.update(id, { statut });
  }

  async getConnaissementsByStatut(statut) {
    return await this.connaissementRepo.findByStatut(statut);
  }

  async deleteConnaissement(id) {
    const existing = await this.connaissementRepo.findById(id);
    if (!existing) {
      throw new Error('Connaissement non trouvé');
    }

    return await this.connaissementRepo.delete(id);
  }
}

export default ConnaissementService;