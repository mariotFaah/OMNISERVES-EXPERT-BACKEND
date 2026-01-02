import { ClientRepository } from '../repositories/ClientRepository.js';
import { ContactRepository } from '../repositories/ContactRepository.js';
import { DevisRepository } from '../repositories/DevisRepository.js';
import { ContratRepository } from '../repositories/ContratRepository.js';
import { ActiviteRepository } from '../repositories/ActiviteRepository.js';
import { ComptabiliteIntegrationService } from './ComptabiliteIntegrationService.js';
import { ImportExportIntegrationService } from './ImportExportIntegrationService.js';

export class ClientService {
  constructor() {
    this.clientRepository = new ClientRepository();
    this.contactRepository = new ContactRepository();
    this.devisRepository = new DevisRepository();
    this.contratRepository = new ContratRepository();
    this.activiteRepository = new ActiviteRepository();
    this.comptabiliteIntegration = new ComptabiliteIntegrationService();
    this.importExportIntegration = new ImportExportIntegrationService();
  }

  async getAllClients() {
    try {
      const clients = await this.clientRepository.findAllWithCRM();
      
      // S'assurer que l'ID est correctement retourné
      return clients.map(client => ({
        id: client.id_tiers,  // ← CORRECTION ICI
        ...client
      }));
    } catch (error) {
      console.error('Erreur ClientService.getAllClients:', error);
      throw new Error('Erreur lors de la récupération des clients');
    }
  }

  async getClientDetails(id_tiers) {
    try {
      const client = await this.clientRepository.findByIdWithDetails(id_tiers);
      
      if (!client) {
        throw new Error('Client non trouvé');
      }

      // CORRECTION : S'assurer que l'ID est retourné
      const clientAvecId = {
        id: client.id_tiers,  // ← CORRECTION ICI
        ...client
      };

      // Récupérer les statistiques complètes
      const stats = await this.clientRepository.getClientStats(id_tiers);
      const statsImportExport = await this.importExportIntegration.getStatsImportExportByClient(id_tiers);
      const chiffreAffaires = await this.comptabiliteIntegration.getChiffreAffairesByClient(id_tiers);
      
      return {
        ...clientAvecId,
        stats: {
          ...stats,
          ...statsImportExport,
          chiffre_affaires_comptabilite: chiffreAffaires
        }
      };
    } catch (error) {
      console.error('Erreur ClientService.getClientDetails:', error);
      throw new Error(`Erreur lors de la récupération du client: ${error.message}`);
    }
  }

  async updateClientCRM(id_tiers, crmData) {
    try {
      const existingClient = await this.clientRepository.findByIdWithDetails(id_tiers);
      if (!existingClient) {
        throw new Error('Client non trouvé');
      }

      const updatedClient = await this.clientRepository.updateCRMData(id_tiers, crmData);
      
      // CORRECTION : Retourner avec l'ID correct
      return {
        id: updatedClient.id_tiers,
        ...updatedClient
      };
    } catch (error) {
      console.error('Erreur ClientService.updateClientCRM:', error);
      throw new Error(`Erreur lors de la mise à jour du client: ${error.message}`);
    }
  }

  async getClientActivites(id_tiers) {
    try {
      return await this.activiteRepository.findByClient(id_tiers);
    } catch (error) {
      console.error('Erreur ClientService.getClientActivites:', error);
      throw new Error('Erreur lors de la récupération des activités');
    }
  }

  async getClientDevis(id_tiers) {
    try {
      return await this.devisRepository.findByClient(id_tiers);
    } catch (error) {
      console.error('Erreur ClientService.getClientDevis:', error);
      throw new Error('Erreur lors de la récupération des devis');
    }
  }

  async getClientContrats(id_tiers) {
    try {
      return await this.contratRepository.findByClient(id_tiers);
    } catch (error) {
      console.error('Erreur ClientService.getClientContrats:', error);
      throw new Error('Erreur lors de la récupération des contrats');
    }
  }

  async getClientsByCategorie(categorie) {
    try {
      const clients = await this.clientRepository.findAllWithCRM();
      const filteredClients = clients.filter(client => client.categorie === categorie);
      
      // CORRECTION : S'assurer que l'ID est retourné
      return filteredClients.map(client => ({
        id: client.id_tiers,
        ...client
      }));
    } catch (error) {
      console.error('Erreur ClientService.getClientsByCategorie:', error);
      throw new Error('Erreur lors du filtrage des clients par catégorie');
    }
  }

  async getActivitesConsolidees(id_tiers) {
    try {
      // Récupérer les activités de tous les modules
      const activitesCRM = await this.activiteRepository.findByClient(id_tiers);
      const facturesComptabilite = await this.comptabiliteIntegration.getFacturesImpayeesByClient(id_tiers);
      const paiementsComptabilite = await this.comptabiliteIntegration.getPaiementsByClient(id_tiers);
      const commandesImportExport = await this.importExportIntegration.getCommandesByClient(id_tiers);
      const expeditionsImportExport = await this.importExportIntegration.getExpeditionsByClient(id_tiers);
      
      // Fusionner toutes les activités
      const toutesActivites = [
        ...activitesCRM.map(a => ({ ...a, type: 'crm', source: 'activite' })),
        ...facturesComptabilite,
        ...paiementsComptabilite,
        ...commandesImportExport,
        ...expeditionsImportExport
      ].sort((a, b) => new Date(b.date_activite) - new Date(a.date_activite));
      
      return toutesActivites;
    } catch (error) {
      console.error('Erreur ClientService.getActivitesConsolidees:', error);
      throw new Error('Erreur lors de la récupération des activités consolidées');
    }
  }
}

export default ClientService;