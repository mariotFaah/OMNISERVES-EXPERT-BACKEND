// src/modules/comptabilite/services/StatistiqueService.js
import { db } from '../../../core/database/connection.js';
import { FactureRepository } from '../repositories/FactureRepository.js';
import { PaiementRepository } from '../repositories/PaiementRepository.js';
import { TiersRepository } from '../repositories/TiersRepository.js';
import { ArticleRepository } from '../repositories/ArticleRepository.js';

export class StatistiqueService {
  constructor() {
    this.factureRepo = new FactureRepository();
    this.paiementRepo = new PaiementRepository();
    this.tiersRepo = new TiersRepository();
    this.articleRepo = new ArticleRepository();
  }

  async getChiffreAffaire(date_debut = '2024-01-01', date_fin = '2024-12-31') {
    try {
      const factures = await this.factureRepo.findAll();
      
      // Filtrer manuellement par période
      const facturesPeriode = factures.filter(f => {
        const dateFacture = new Date(f.date);
        return dateFacture >= new Date(date_debut) && dateFacture <= new Date(date_fin);
      });
      
      const ca_ht = facturesPeriode.reduce((sum, f) => sum + parseFloat(f.total_ht || 0), 0);
      const ca_ttc = facturesPeriode.reduce((sum, f) => sum + parseFloat(f.total_ttc || 0), 0);
      const tva_collectee = facturesPeriode.reduce((sum, f) => sum + parseFloat(f.total_tva || 0), 0);
      
      return {
        periode: `${date_debut} à ${date_fin}`,
        chiffre_affaire_ht: ca_ht,
        chiffre_affaire_ttc: ca_ttc,
        tva_collectee: tva_collectee,
        nombre_factures: facturesPeriode.length,
        factures_validees: facturesPeriode.filter(f => f.statut === 'validee').length
      };
    } catch (error) {
      throw new Error('Erreur calcul chiffre d\'affaire: ' + error.message);
    }
  }

 
async getTopClients(limit = 10) {
  try {
    const clients = await this.tiersRepo.findAll();
    const toutesFactures = await this.factureRepo.findAll();
    
    console.log('🔍 DEBUG: Structure complète première facture:', JSON.stringify(toutesFactures[0], null, 2));
    
    const clientsAvecCA = clients
      .filter(client => client.type_tiers === 'client')
      .map(client => {
        // FILTRER par nom_tiers puisque id_tiers n'est pas disponible
        const facturesClient = toutesFactures.filter(f => 
          f.nom_tiers && f.nom_tiers === client.nom && f.statut === 'validee'
        );
        
        const ca = facturesClient.reduce((sum, f) => 
          sum + parseFloat(f.total_ttc || 0), 0
        );
        
        facturesClient.forEach(f => {
          console.log(`   - Facture ${f.numero_facture}: ${f.total_ttc} MGA (${f.nom_tiers})`);
        });
        
        return {
          id_tiers: client.id_tiers,
          nom: client.nom,
          chiffre_affaire: ca,
          nombre_factures: facturesClient.length,
          email: client.email,
          telephone: client.telephone
        };
      })
      .filter(client => client.chiffre_affaire > 0)
      .sort((a, b) => b.chiffre_affaire - a.chiffre_affaire)
      .slice(0, limit);
    
    return clientsAvecCA;
  } catch (error) {
    throw new Error('Erreur calcul top clients: ' + error.message);
  }
}
  async getTopProduits(limit = 10) {
    try {
      const articles = await this.articleRepo.findAll();
      
      return articles
        .sort((a, b) => parseFloat(b.prix_unitaire) - parseFloat(a.prix_unitaire))
        .slice(0, limit)
        .map(article => ({
          code_article: article.code_article,
          description: article.description,
          prix_unitaire: parseFloat(article.prix_unitaire),
          unite: article.unite,
          devise: article.devise
        }));
    } catch (error) {
      throw new Error('Erreur calcul top produits: ' + error.message);
    }
  }

  async getIndicateurs() {
    try {
      const factures = await this.factureRepo.findAll();
      const paiements = await this.paiementRepo.getPaiements();
      const clients = await this.tiersRepo.findAll();
      const fournisseurs = clients.filter(t => t.type_tiers === 'fournisseur');
      
      const ca_total = factures
        .filter(f => f.statut === 'validee')
        .reduce((sum, f) => sum + parseFloat(f.total_ttc || 0), 0);
      
      const total_paiements = paiements.reduce((sum, p) => sum + parseFloat(p.montant || 0), 0);
      
      return {
        total_clients: clients.filter(t => t.type_tiers === 'client').length,
        total_fournisseurs: fournisseurs.length,
        total_factures: factures.length,
        chiffre_affaire_total: ca_total,
        total_paiements: total_paiements,
        factures_en_attente: factures.filter(f => f.statut === 'brouillon').length,
        factures_validees: factures.filter(f => f.statut === 'validee').length
      };
    } catch (error) {
      throw new Error('Erreur calcul indicateurs: ' + error.message);
    }
  }
}