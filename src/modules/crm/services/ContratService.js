import { ContratRepository } from '../repositories/ContratRepository.js';

export class ContratService {
  constructor() {
    this.contratRepository = new ContratRepository();
  }

  async getAllContrats() {
    try {
      return await this.contratRepository.findAll();
    } catch (error) {
      console.error('Erreur ContratService.getAllContrats:', error);
      throw new Error('Erreur lors de la récupération des contrats');
    }
  }

  async getContratById(id_contrat) {
    try {
      const contrat = await this.contratRepository.findById(id_contrat);
      
      if (!contrat) {
        throw new Error('Contrat non trouvé');
      }

      return contrat;
    } catch (error) {
      console.error('Erreur ContratService.getContratById:', error);
      throw new Error(`Erreur lors de la récupération du contrat: ${error.message}`);
    }
  }

  async getContratsByClient(tiers_id) {
    try {
      return await this.contratRepository.findByClient(tiers_id);
    } catch (error) {
      console.error('Erreur ContratService.getContratsByClient:', error);
      throw new Error('Erreur lors de la récupération des contrats du client');
    }
  }

  async createContrat(contratData) {
    try {
      // Validation des données requises
      if (!contratData.tiers_id || !contratData.type_contrat || !contratData.date_debut) {
        throw new Error('Le client, le type de contrat et la date de début sont obligatoires');
      }

      // Calcul automatique du TTC avec TVA à 20%
      const tvaRate = 0.20;
      const montantHT = parseFloat(contratData.montant_ht) || 0;
      const montantTTC = montantHT * (1 + tvaRate);

      // Générer le numéro de contrat automatique
      const dernierContrat = await this.contratRepository.findLast();
      const numeroContrat = this.genererNumeroContrat(dernierContrat);

      const contratDataComplet = {
        ...contratData,
        numero_contrat: numeroContrat,
        montant_ht: montantHT,
        montant_ttc: montantTTC,
        statut: contratData.statut || 'actif'
      };

      return await this.contratRepository.create(contratDataComplet);
    } catch (error) {
      console.error('Erreur ContratService.createContrat:', error);
      throw new Error(`Erreur lors de la création du contrat: ${error.message}`);
    }
  }

  async updateContrat(id_contrat, contratData) {
    try {
      // Vérifier que le contrat existe
      const existingContrat = await this.contratRepository.findById(id_contrat);
      if (!existingContrat) {
        throw new Error('Contrat non trouvé');
      }

      // Recalculer TTC si montant HT modifié
      if (contratData.montant_ht !== undefined) {
        const tvaRate = 0.20;
        const montantHT = parseFloat(contratData.montant_ht);
        contratData.montant_ttc = montantHT * (1 + tvaRate);
      }

      return await this.contratRepository.update(id_contrat, contratData);
    } catch (error) {
      console.error('Erreur ContratService.updateContrat:', error);
      throw new Error(`Erreur lors de la mise à jour du contrat: ${error.message}`);
    }
  }

  async updateContratStatut(id_contrat, statut) {
    try {
      const statutsValides = ['actif', 'inactif', 'resilie', 'termine'];
      if (!statutsValides.includes(statut)) {
        throw new Error('Statut invalide');
      }

      const existingContrat = await this.contratRepository.findById(id_contrat);
      if (!existingContrat) {
        throw new Error('Contrat non trouvé');
      }

      return await this.contratRepository.updateStatut(id_contrat, statut);
    } catch (error) {
      console.error('Erreur ContratService.updateContratStatut:', error);
      throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
    }
  }

  async getContratStats() {
    try {
      return await this.contratRepository.getStats();
    } catch (error) {
      console.error('Erreur ContratService.getContratStats:', error);
      throw new Error('Erreur lors du calcul des statistiques des contrats');
    }
  }

  genererNumeroContrat(dernierContrat) {
    if (!dernierContrat || !dernierContrat.numero_contrat) {
      return 'CONT-2024-001';
    }
    
    const dernierNumero = dernierContrat.numero_contrat;
    const match = dernierNumero.match(/CONT-(\d{4})-(\d+)/);
    
    if (match) {
      const annee = match[1];
      const numero = parseInt(match[2]) + 1;
      return `CONT-${annee}-${numero.toString().padStart(3, '0')}`;
    }
    
    // Fallback
    const nouvelId = dernierContrat.id_contrat ? parseInt(dernierContrat.id_contrat) + 1 : 1;
    return `CONT-2024-${nouvelId.toString().padStart(3, '0')}`;
  }
}

export default ContratService;