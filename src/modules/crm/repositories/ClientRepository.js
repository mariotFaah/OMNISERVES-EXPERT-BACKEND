import { db } from '../../../core/database/connection.js';
import { Client } from '../entities/Client.js';

export class ClientRepository {
  
  async findAllWithCRM() {
    try {
      const clients = await db('tiers')
        .select('*')
        .orderBy('nom', 'asc');
      
      // MAPPER vers l'entité Client
      return clients.map(client => new Client(client));
    } catch (error) {
      console.error('Erreur ClientRepository.findAllWithCRM:', error);
      throw new Error('Erreur lors de la récupération des clients');
    }
  }

  async findByIdWithDetails(id_tiers) {
    try {
      const client = await db('tiers')
        .where('id_tiers', id_tiers)
        .first();
      
      if (!client) return null;

      // Récupérer les contacts
      const contacts = await db('contacts')
        .where('tiers_id', id_tiers)
        .orderBy('principal', 'desc')
        .orderBy('nom', 'asc');

      // Récupérer les devis
      const devis = await db('devis')
        .where('tiers_id', id_tiers)
        .orderBy('date_devis', 'desc')
        .limit(10);

      // Récupérer les contrats actifs
      const contrats = await db('contrats')
        .where('tiers_id', id_tiers)
        .where('statut', 'actif')
        .orderBy('date_debut', 'desc');

      // Récupérer les activités récentes
      const activites = await db('activites')
        .where('tiers_id', id_tiers)
        .orderBy('date_activite', 'desc')
        .limit(10);

      // RETOURNER UNE INSTANCE DE CLIENT
      return new Client({
        ...client,
        contacts,
        devis,
        contrats,
        activites
      });
    } catch (error) {
      console.error('Erreur ClientRepository.findByIdWithDetails:', error);
      throw new Error('Erreur lors de la récupération du client');
    }
  }

  async updateCRMData(id_tiers, crmData) {
    try {
      await db('tiers')
        .where('id_tiers', id_tiers)
        .update({
          ...crmData,
          updated_at: new Date()
        });
      
      return await this.findByIdWithDetails(id_tiers);
    } catch (error) {
      console.error('Erreur ClientRepository.updateCRMData:', error);
      throw new Error('Erreur lors de la mise à jour des données CRM');
    }
  }

  async getClientStats(id_tiers) {
    try {
      const stats = await db('tiers')
        .leftJoin('devis', 'tiers.id_tiers', 'devis.tiers_id')
        .leftJoin('contrats', 'tiers.id_tiers', 'contrats.tiers_id')
        .leftJoin('activites', 'tiers.id_tiers', 'activites.tiers_id')
        .where('tiers.id_tiers', id_tiers)
        .select(
          'tiers.id_tiers',
          db.raw('COUNT(DISTINCT devis.id_devis) as total_devis'),
          db.raw('COUNT(DISTINCT contrats.id_contrat) as total_contrats'),
          db.raw('COUNT(DISTINCT activites.id_activite) as total_activites'),
          db.raw('SUM(CASE WHEN devis.statut = "accepte" THEN devis.montant_ttc ELSE 0 END) as ca_devis'),
          db.raw('SUM(contrats.montant_ht) as ca_contrats')
        )
        .first();
      
      return stats;
    } catch (error) {
      console.error('Erreur ClientRepository.getClientStats:', error);
      throw new Error('Erreur lors du calcul des statistiques client');
    }
  }
}

export default ClientRepository;
