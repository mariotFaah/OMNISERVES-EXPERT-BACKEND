// src/modules/comptabilite/services/RapportService.js - VERSION CORRIGÉE
import { EcritureComptableRepository } from '../repositories/EcritureComptableRepository.js';
import { FactureRepository } from '../repositories/FactureRepository.js';
import { PaiementRepository } from '../repositories/PaiementRepository.js';

export class RapportService {
  constructor() {
    this.ecritureRepo = new EcritureComptableRepository();
    this.factureRepo = new FactureRepository();
    this.paiementRepo = new PaiementRepository();
  }

  async genererBilan(date_fin) {
    const comptes = [
      '101000', '102000', '103000', // Capitaux
      '211000', '213000', '215000', // Immobilisations
      '311000', '312000', '313000', // Stocks
      '411000', '412000', // Clients
      '511000', '512000', '513000', // Banque
      '445710', '445700', '445620', '445600' // TVA - TOUS LES COMPTES
    ];

    const bilan = {};
    
    for (const compte of comptes) {
      bilan[compte] = await this.ecritureRepo.getSoldeCompte(compte, date_fin);
    }

    return bilan;
  }

  async genererCompteResultat(date_debut, date_fin) {
    const comptes_charges = ['601000', '602000', '607000', '611000', '612000', '613000'];
    const comptes_produits = ['701000', '702000', '703000', '704000', '705000'];

    const resultat = {
      charges: 0,
      produits: 0
    };

    for (const compte of comptes_charges) {
      const solde = await this.ecritureRepo.getSoldeCompte(compte, date_fin);
      resultat.charges += Math.abs(solde.solde);
    }

    for (const compte of comptes_produits) {
      const solde = await this.ecritureRepo.getSoldeCompte(compte, date_fin);
      resultat.produits += Math.abs(solde.solde);
    }

    resultat.resultat_net = resultat.produits - resultat.charges;

    return resultat;
  }

  async genererTresorerie(date_debut = '2024-01-01', date_fin = '2024-12-31') {
    try {
      const paiementsData = await this.paiementRepo.getPaiementsByPeriode(date_debut, date_fin);
      const facturesData = await this.factureRepo.getFacturesByPeriode(date_debut, date_fin);
      
      const entrees = parseFloat(paiementsData.total) || 0;
      const sorties_prevues = parseFloat(facturesData.total) || 0;

      return {
        entrees: entrees,
        sorties_prevues: sorties_prevues,
        solde_tresorerie: entrees - sorties_prevues,
        periode: `${date_debut} à ${date_fin}`,
        details: {
          total_paiements: entrees,
          total_factures: sorties_prevues
        }
      };
    } catch (error) {
      console.error('Erreur RapportService.genererTresorerie:', error);
      const paiements = await this.paiementRepo.findByPeriode(date_debut, date_fin);
      const factures = await this.factureRepo.findAll();
      
      const entrees = paiements.reduce((sum, p) => sum + parseFloat(p.montant), 0);
      const facturesPeriode = factures.filter(f => 
        f.date >= date_debut && f.date <= date_fin
      );
      const sorties_prevues = facturesPeriode.reduce((sum, f) => sum + parseFloat(f.total_ttc), 0);

      return {
        entrees: entrees,
        sorties_prevues: sorties_prevues,
        solde_tresorerie: entrees - sorties_prevues,
        periode: `${date_debut} à ${date_fin}`,
        note: "Calculé à partir des données disponibles"
      };
    }
  }

  async genererRapportTVA(date_debut = '2024-01-01', date_fin = '2024-12-31') {
    try {
      console.log('📊 Génération rapport TVA pour:', date_debut, 'à', date_fin);
      
      // CORRECTION : Utiliser query() au lieu de findByPeriode()
      const toutesEcritures = await this.ecritureRepo.query()
        .whereBetween('date', [date_debut, date_fin])
        .select('*');
      
      console.log(`📈 ${toutesEcritures.length} écritures totales trouvées`);

      let tva_collectee = 0;
      let tva_deductible = 0;

      // ANALYSE PAR JOURNAL pour bien séparer TVA collectée/déductible
      toutesEcritures.forEach(ecriture => {
        const compte = ecriture.compte;
        const credit = parseFloat(ecriture.credit) || 0;
        const debit = parseFloat(ecriture.debit) || 0;
        const journal = ecriture.journal;
        
        // TVA COLLECTÉE : Crédits sur comptes TVA dans le journal VENTES
        if (['445710', '445700', '445620', '445600'].includes(compte) && journal === 'ventes') {
          tva_collectee += credit;
          console.log(`✅ TVA collectée (ventes): ${compte} - Crédit: ${credit}`);
        }
        
        // TVA DÉDUCTIBLE : Débits sur comptes TVA dans le journal ACHATS
        if (['445710', '445700', '445620', '445600'].includes(compte) && journal === 'achats') {
          tva_deductible += debit;
          console.log(`✅ TVA déductible (achats): ${compte} - Débit: ${debit}`);
        }
      });

      const tva_a_payer = tva_collectee - tva_deductible;

      console.log('📋 Résultat TVA FINAL:', {
        collectee: tva_collectee,
        deductible: tva_deductible,
        a_payer: tva_a_payer
      });

      return {
        tva_collectee: tva_collectee,
        tva_deductable: tva_deductible,
        tva_a_payer: tva_a_payer,
        periode: `${date_debut} à ${date_fin}`,
        nombre_ecritures: toutesEcritures.length,
        details: {
          comptes_collectee: ['445710', '445700', '445620', '445600'],
          comptes_deductible: ['445710', '445700', '445620', '445600'],
          date_generation: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('❌ Erreur génération rapport TVA:', error);
      
      // SOLUTION DE REPLI AMÉLIORÉE
      try {
        console.log('🔄 Utilisation solution de repli TVA');
        
        let tva_collectee_total = 0;
        let tva_deductible_total = 0;
        
        // TVA collectée - crédits sur tous les comptes TVA dans le journal VENTES
        const comptesTVA = ['445710', '445700', '445620', '445600'];
        
        for (const compte of comptesTVA) {
          try {
            // Récupérer les écritures spécifiques par compte et journal
            const ecrituresVentes = await this.ecritureRepo.query()
              .where('compte', compte)
              .where('journal', 'ventes')
              .whereBetween('date', [date_debut, date_fin])
              .select('*');
              
            const ecrituresAchats = await this.ecritureRepo.query()
              .where('compte', compte)
              .where('journal', 'achats')
              .whereBetween('date', [date_debut, date_fin])
              .select('*');
            
            // TVA collectée = crédits dans ventes
            ecrituresVentes.forEach(e => {
              tva_collectee_total += parseFloat(e.credit) || 0;
              console.log(`🔄 TVA collectée ${compte} (ventes): ${e.credit}`);
            });
            
            // TVA déductible = débits dans achats
            ecrituresAchats.forEach(e => {
              tva_deductible_total += parseFloat(e.debit) || 0;
              console.log(`🔄 TVA déductible ${compte} (achats): ${e.debit}`);
            });
            
          } catch (e) {
            console.log(`ℹ️ Compte ${compte} non trouvé ou erreur`);
          }
        }

        return {
          tva_collectee: tva_collectee_total,
          tva_deductable: tva_deductible_total,
          tva_a_payer: tva_collectee_total - tva_deductible_total,
          periode: `${date_debut} à ${date_fin}`,
          note: "Calculé à partir des écritures par journal (solution de repli)"
        };
      } catch (fallbackError) {
        console.error('❌ Erreur solution de repli TVA:', fallbackError);
        
        // Dernière solution - retourner des données par défaut
        return {
          tva_collectee: 0,
          tva_deductable: 0,
          tva_a_payer: 0,
          periode: `${date_debut} à ${date_fin}`,
          note: "Données temporairement indisponibles"
        };
      }
    }
  }
}