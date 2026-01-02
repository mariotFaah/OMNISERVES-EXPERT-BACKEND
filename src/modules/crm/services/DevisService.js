import { DevisRepository } from '../repositories/DevisRepository.js';
import { ContratRepository } from '../repositories/ContratRepository.js';

export class DevisService {
  constructor() {
    this.devisRepository = new DevisRepository();
    this.contratRepository = new ContratRepository(); // ← AJOUT IMPORTANT
  }

  async getAllDevis() {
    try {
      return await this.devisRepository.findAll();
    } catch (error) {
      console.error('Erreur DevisService.getAllDevis:', error);
      throw new Error('Erreur lors de la récupération des devis');
    }
  }

  async getDevisById(id_devis) {
    try {
      const devis = await this.devisRepository.findById(id_devis);
      
      if (!devis) {
        throw new Error('Devis non trouvé');
      }

      return devis;
    } catch (error) {
      console.error('Erreur DevisService.getDevisById:', error);
      throw new Error(`Erreur lors de la récupération du devis: ${error.message}`);
    }
  }

  async createDevis(devisData) {
    try {
      // Validation des données requises
      if (!devisData.tiers_id || !devisData.date_devis) {
        throw new Error('Le client et la date sont obligatoires');
      }

      // Calcul automatique du TTC avec TVA à 20%
      const tvaRate = 0.20;
      const montantHT = parseFloat(devisData.montant_ht) || 0;
      const montantTTC = montantHT * (1 + tvaRate);

      // S'assurer que les données incluent le TTC calculé
      const devisDataComplet = {
        ...devisData,
        montant_ht: montantHT,
        montant_ttc: montantTTC,
        statut: devisData.statut || 'brouillon'
      };

      return await this.devisRepository.create(devisDataComplet);
    } catch (error) {
      console.error('Erreur DevisService.createDevis:', error);
      throw new Error(`Erreur lors de la création du devis: ${error.message}`);
    }
  }

  async updateDevis(id_devis, devisData) {
    try {
      // Vérifier que le devis existe
      const existingDevis = await this.devisRepository.findById(id_devis);
      if (!existingDevis) {
        throw new Error('Devis non trouvé');
      }

      // Recalculer TTC si montant HT modifié
      if (devisData.montant_ht !== undefined) {
        const tvaRate = 0.20;
        const montantHT = parseFloat(devisData.montant_ht);
        devisData.montant_ttc = montantHT * (1 + tvaRate);
      }

      return await this.devisRepository.update(id_devis, devisData);
    } catch (error) {
      console.error('Erreur DevisService.updateDevis:', error);
      throw new Error(`Erreur lors de la mise à jour du devis: ${error.message}`);
    }
  }

  async updateDevisStatut(id_devis, statut) {
    try {
      const statutsValides = ['brouillon', 'envoye', 'accepte', 'refuse', 'expire'];
      if (!statutsValides.includes(statut)) {
        throw new Error('Statut invalide');
      }

      const existingDevis = await this.devisRepository.findById(id_devis);
      if (!existingDevis) {
        throw new Error('Devis non trouvé');
      }

      return await this.devisRepository.updateStatut(id_devis, statut);
    } catch (error) {
      console.error('Erreur DevisService.updateDevisStatut:', error);
      throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
    }
  }

  async getDevisStats() {
    try {
      return await this.devisRepository.getStats();
    } catch (error) {
      console.error('Erreur DevisService.getDevisStats:', error);
      throw new Error('Erreur lors du calcul des statistiques des devis');
    }
  }

  async getDevisByStatut(statut) {
    try {
      const allDevis = await this.devisRepository.findAll();
      return allDevis.filter(devis => devis.statut === statut);
    } catch (error) {
      console.error('Erreur DevisService.getDevisByStatut:', error);
      throw new Error('Erreur lors du filtrage des devis par statut');
    }
  }

    async transformerDevisEnContrat(id_devis, donneesContrat) {
    try {
      const devis = await this.devisRepository.findById(id_devis);
      
      if (!devis) {
        throw new Error('Devis non trouvé');
      }
      
      // VÉRIFICATION RENFORCÉE
      if (devis.statut !== 'accepte') {
        throw new Error('Seuls les devis acceptés peuvent être transformés en contrat');
      }
      
      // VÉRIFIER SI CONTRAT EXISTE DÉJÀ
      const contratExistant = await this.contratRepository.findByDevisId(id_devis);
      if (contratExistant) {
        throw new Error('Un contrat existe déjà pour ce devis');
      }
      
      // Génération numéro contrat
      const dernierContrat = await this.contratRepository.findLast();
      const nouveauNumero = this.genererNumeroContrat(dernierContrat);
      
      const contratData = {
        numero_contrat: nouveauNumero,
        tiers_id: devis.tiers_id,
        devis_id: id_devis,
        type_contrat: donneesContrat.type_contrat || 'Maintenance',
        date_debut: donneesContrat.date_debut || new Date(),
        date_fin: donneesContrat.date_fin,
        statut: 'actif',
        montant_ht: devis.montant_ht,
        montant_ttc: devis.montant_ttc,
        periodicite: donneesContrat.periodicite || 'ponctuel',
        description: donneesContrat.description || devis.objet,
        conditions: donneesContrat.conditions || devis.conditions
      };
      
      const contrat = await this.contratRepository.create(contratData);
      
      // CORRECTION : Mettre à jour le statut du devis
      await this.devisRepository.updateStatut(id_devis, 'transforme_contrat');
      
      return contrat;
    } catch (error) {
      console.error('Erreur transformation devis en contrat:', error);
      throw error;
    }
  }

  // Méthode pour générer le numéro de contrat

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
  
  // Fallback - utiliser l'ID si pas de format reconnu
  const nouvelId = dernierContrat.id_contrat ? parseInt(dernierContrat.id_contrat) + 1 : 1;
  return `CONT-2024-${nouvelId.toString().padStart(3, '0')}`;
}
}

export default DevisService;