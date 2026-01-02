import BaseRepository from '../../../core/database/BaseRepository.js';
import Commande from '../entities/Commande.js';
import LigneCommande from '../entities/LigneCommande.js';

class CommandeRepository extends BaseRepository {
  constructor() {
    super('commandes');
  }

  async findAllWithRelations(filters = {}) {
   
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
        'fournisseur.adresse as fournisseur_adresse',
        this.db.raw('COALESCE(SUM(lc.quantite * lc.prix_unitaire * (1 + lc.taux_tva / 100)), 0) as montant_total')
      )
      .from('commandes as c')
      .leftJoin('tiers as client', 'c.client_id', 'client.id_tiers')
      .leftJoin('tiers as fournisseur', 'c.fournisseur_id', 'fournisseur.id_tiers')
      .leftJoin('lignes_commande as lc', 'lc.commande_id', 'c.id')
      .groupBy('c.id', 'client.id_tiers', 'fournisseur.id_tiers');

    if (filters.type) query.where('c.type', filters.type);
    if (filters.statut) query.where('c.statut', filters.statut);
    if (filters.client_id) query.where('c.client_id', filters.client_id);

    const commandes = await query.orderBy('c.created_at', 'desc');

    const commandesAvecRelations = await Promise.all(
      commandes.map(async (cmd) => {
        try {
          const expedition = await this.db('expeditions').where('commande_id', cmd.id).first();
          const couts = await this.db('couts_logistiques').where('commande_id', cmd.id).first();
          const lignes = await this.db('lignes_commande as lc')
            .select('lc.*', 'a.code_article as article_code', 'a.description as article_description')
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
            expedition: expedition || null,
            couts_logistiques: couts || {
              fret_maritime: 0,
              fret_aerien: 0,
              assurance: 0,
              droits_douane: 0,
              frais_transit: 0,
              transport_local: 0,
              autres_frais: 0
            }
          });
        } catch (error) {
          console.error(`❌ Erreur chargement relations commande ${cmd.id}:`, error);
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
            couts_logistiques: {
              fret_maritime: 0,
              fret_aerien: 0,
              assurance: 0,
              droits_douane: 0,
              frais_transit: 0,
              transport_local: 0,
              autres_frais: 0
            }
          });
        }
      })
    );

    return commandesAvecRelations;
  }

  async findByIdWithRelations(id) {
    const commande = await this.db
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
      .leftJoin('tiers as fournisseur', 'c.fournisseur_id', 'fournisseur.id_tiers')
      .where('c.id', id)
      .first();

    if (!commande) return null;

    const lignes = await this.db('lignes_commande as lc')
      .select('lc.*', 'a.code_article as article_code', 'a.description as article_description')
      .leftJoin('articles as a', 'lc.article_id', 'a.code_article')
      .where('lc.commande_id', id);

    const expedition = await this.db('expeditions').where('commande_id', id).first();
    const couts = await this.db('couts_logistiques').where('commande_id', id).first();

    return new Commande({
      ...commande,
      client: {
        id: commande.client_id,
        nom: commande.client_nom,
        email: commande.client_email,
        telephone: commande.client_telephone,
        adresse: commande.client_adresse
      },
      fournisseur: {
        id: commande.fournisseur_id,
        nom: commande.fournisseur_nom,
        email: commande.fournisseur_email,
        telephone: commande.fournisseur_telephone,
        adresse: commande.fournisseur_adresse
      },
      lignes: lignes.map(l => new LigneCommande({
        ...l,
        article: l.article_id ? {
          code_article: l.article_id,
          code: l.article_code,
          description: l.article_description
        } : null
      })),
      expedition: expedition || null,
      couts_logistiques: couts || {
        fret_maritime: 0,
        fret_aerien: 0,
        assurance: 0,
        droits_douane: 0,
        frais_transit: 0,
        transport_local: 0,
        autres_frais: 0
      }
    });
  }

  async createWithLignes(commandeData, lignesData = []) {
    return await this.db.transaction(async (trx) => {
      const [commandeId] = await trx('commandes').insert({
        ...commandeData,
        numero_commande: trx.raw('CONCAT("CMD-", LPAD((SELECT COUNT(*) + 1 FROM commandes), 6, "0"))')
      });

      if (lignesData.length > 0) {
        const lignes = lignesData.map(ligne => ({
          ...ligne,
          commande_id: commandeId
        }));
        await trx('lignes_commande').insert(lignes);

        const total = lignes.reduce((sum, ligne) => {
          return sum + (ligne.quantite * ligne.prix_unitaire * (1 + (ligne.taux_tva || 0) / 100));
        }, 0);

        await trx('commandes').where('id', commandeId).update({ montant_total: total });
      }

      return commandeId;
    });
  }

  async updateStatut(id, statut) {
    const statutsValides = ['brouillon', 'confirmée', 'expédiée', 'livrée', 'annulée'];
    if (!statutsValides.includes(statut)) {
      throw new Error(`Statut invalide: ${statut}`);
    }

    return await this.db('commandes')
      .where('id', id)
      .update({
        statut,
        updated_at: this.db.fn.now()
      });
  }
}

export default CommandeRepository;
