// src/modules/import-export/repositories/CommandeRepository.js
import BaseRepository from '../../../core/database/BaseRepository.js';
import Commande from '../entities/Commande.js';
import LigneCommande from '../entities/LigneCommande.js';

class CommandeRepository extends BaseRepository {
  constructor() {
    super('commandes');
  }

  async findAllWithRelations(filters = {}) {
    console.log('🔍 findAllWithRelations appelé avec filtres:', filters);
    
    const query = this.db
      .select(
        'c.*',
        'client.nom as client_nom',
        'client.email as client_email',
        'client.telephone as client_telephone',
        'client.adresse as client_adresse',
        'fournisseur.nom as fournisseur_nom',
        'fournisseur.email as fournisseur_email',
        'fournisseur.telephone as fournisseur_telephone',
        'fournisseur.adresse as fournisseur_adresse'
      )
      .from('commandes as c')
      .leftJoin('tiers as client', 'c.client_id', 'client.id_tiers')
      .leftJoin('tiers as fournisseur', 'c.fournisseur_id', 'fournisseur.id_tiers');

    if (filters.type) query.where('c.type', filters.type);
    if (filters.statut) query.where('c.statut', filters.statut);
    if (filters.client_id) query.where('c.client_id', filters.client_id);

    const commandes = await query.orderBy('c.created_at', 'desc');
    
    console.log(`📦 ${commandes.length} commandes trouvées`);

    // CHARGER LES RELATIONS POUR CHAQUE COMMANDE
    const commandesAvecRelations = await Promise.all(
      commandes.map(async (cmd) => {
        try {
          // Récupérer l'expédition
          const expedition = await this.db
            .select('*')
            .from('expeditions')
            .where('commande_id', cmd.id)
            .first();

          // Récupérer les coûts logistiques
          const couts = await this.db
            .select('*')
            .from('couts_logistiques')
            .where('commande_id', cmd.id)
            .first();

          // Récupérer les lignes de commande
          const lignes = await this.db
            .select('lc.*', 'a.code_article as article_code', 'a.description as article_description')
            .from('lignes_commande as lc')
            .leftJoin('articles as a', 'lc.article_id', 'a.code_article')
            .where('lc.commande_id', cmd.id);

          console.log(`✅ Commande ${cmd.id}:`, {
            hasExpedition: !!expedition,
            hasCouts: !!couts,
            lignesCount: lignes.length
          });

          return new Commande({
            ...cmd,
            client: {
              id: cmd.client_id,
              nom: cmd.client_nom,
              email: cmd.client_email,
              telephone: cmd.client_telephone,
              adresse: cmd.client_adresse
            },
            fournisseur: {
              id: cmd.fournisseur_id,
              nom: cmd.fournisseur_nom,
              email: cmd.fournisseur_email,
              telephone: cmd.fournisseur_telephone,
              adresse: cmd.fournisseur_adresse
            },
            lignes: lignes.map(l => new LigneCommande({
              ...l,
              article: l.article_id ? { 
                code_article: l.article_id,
                code: l.article_code,
                description: l.article_description
              } : null
            })),
            expedition: expedition,
            couts_logistiques: couts
          });
        } catch (error) {
          console.error(`❌ Erreur chargement relations commande ${cmd.id}:`, error);
          // Retourner la commande sans relations en cas d'erreur
          return new Commande({
            ...cmd,
            client: {
              id: cmd.client_id,
              nom: cmd.client_nom,
              email: cmd.client_email,
              telephone: cmd.client_telephone,
              adresse: cmd.client_adresse
            },
            fournisseur: {
              id: cmd.fournisseur_id,
              nom: cmd.fournisseur_nom,
              email: cmd.fournisseur_email,
              telephone: cmd.fournisseur_telephone,
              adresse: cmd.fournisseur_adresse
            },
            lignes: [],
            expedition: null,
            couts_logistiques: null
          });
        }
      })
    );

    console.log(`🎯 Commandes avec relations chargées: ${commandesAvecRelations.length}`);
    return commandesAvecRelations;
  }

  // Garder les autres méthodes existantes...
  async findByIdWithRelations(id) {
    // ... méthode existante inchangée
  }

  async createWithLignes(commandeData, lignesData = []) {
    // ... méthode existante inchangée
  }

  async updateStatut(id, statut) {
    // ... méthode existante inchangée
  }
}

export default CommandeRepository;
