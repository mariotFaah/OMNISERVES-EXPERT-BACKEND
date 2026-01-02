// src/modules/comptabilite/services/JournalService.js 
import { EcritureComptableRepository } from '../repositories/EcritureComptableRepository.js';
import { FactureRepository } from '../repositories/FactureRepository.js';
import { PaiementRepository } from '../repositories/PaiementRepository.js';
import { TiersRepository } from '../repositories/TiersRepository.js';
import { PlanComptableRepository } from '../repositories/PlanComptableRepository.js';
import { ReferentielRepository } from '../repositories/ReferentielRepository.js';
import { db } from '../../../core/database/connection.js';

export class JournalService {
  constructor() {
    this.ecritureRepo = new EcritureComptableRepository();
    this.factureRepo = new FactureRepository();
    this.paiementRepo = new PaiementRepository();
    this.tiersRepo = new TiersRepository();
    this.planComptableRepo = new PlanComptableRepository();
    this.referentielRepo = new ReferentielRepository();
  }

  async genererEcritureFacture(facture) {
    try {
      console.log('📝 Génération écritures pour facture:', facture.numero_facture);
      
      const typeTiers = await this.getTypeTiers(facture.id_tiers);
      
      const isAchat = typeTiers === 'fournisseur';
      const journal = isAchat ? 'achats' : 'ventes';

      // RÉCUPÉRATION DYNAMIQUE DES COMPTES - CORRIGÉE
      const compteTiers = await this.planComptableRepo.findByCategorie(isAchat ? 'fournisseur' : 'client');
      
      // Gestion robuste des comptes TVA
      let compteTVA;
          if (isAchat) {
            // Achats : TVA déductible
            compteTVA = await this.planComptableRepo.findByNumero('445620') 
                        || await this.planComptableRepo.findByNumero('445600');
          } else {
            // Ventes : TVA collectée (priorité à 445710)
            compteTVA = await this.planComptableRepo.findByNumero('445710')
                        || await this.planComptableRepo.findByNumero('445700')
                        || await this.planComptableRepo.findByCategorie('tva');
          }
      
      const compteProduit = await this.planComptableRepo.findByCategorie(isAchat ? 'achat' : 'vente');

      // VÉRIFICATIONS AVEC MESSAGES D'ERREUR DÉTAILLÉS
      if (!compteTiers) {
        const typeCompte = isAchat ? 'fournisseur' : 'client';
        throw new Error(`Compte ${typeCompte} non trouvé dans le plan comptable`);
      }

      if (!compteTVA) {
        const typeTVA = isAchat ? 'déductible (445620/445600)' : 'collectée (445710/445700)';
        throw new Error(`Compte TVA ${typeTVA} non trouvé dans le plan comptable`);
      }

      if (!compteProduit) {
        const typeProduit = isAchat ? 'achat' : 'vente';
        throw new Error(`Compte ${typeProduit} non trouvé dans le plan comptable`);
      }

      console.log('💰 Comptes dynamiques récupérés:', {
        compteTiers: compteTiers.numero_compte,
        compteTVA: compteTVA.numero_compte,
        compteProduit: compteProduit.numero_compte,
        type: isAchat ? 'ACHAT' : 'VENTE'
      });

      const ecritures = [];
      const date = new Date(facture.date);
      const prefix = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      // ÉCRITURE 1: TIERS (Client ou Fournisseur)
      ecritures.push({
        numero_ecriture: `${prefix}-${facture.numero_facture}-1`,
        date: facture.date,
        journal: journal,
        compte: compteTiers.numero_compte,
        libelle: `Facture ${facture.numero_facture} - ${facture.nom_tiers || ''}`,
        // Clients -> DÉBIT (ils nous doivent), Fournisseurs -> CRÉDIT (nous leur devons)
        debit: isAchat ? 0 : facture.total_ttc,      // Clients: débit, Fournisseurs: 0
        credit: isAchat ? facture.total_ttc : 0,     // Clients: 0, Fournisseurs: crédit
        devise: facture.devise || 'MGA',
        taux_change: facture.taux_change || 1,
        reference: facture.numero_facture.toString()
      });

      // ÉCRITURE 2: TVA (si applicable)
      if (facture.total_tva > 0) {
        ecritures.push({
          numero_ecriture: `${prefix}-${facture.numero_facture}-2`,
          date: facture.date,
          journal: journal,
          compte: compteTVA.numero_compte,
          libelle: `TVA Facture ${facture.numero_facture} - ${isAchat ? 'déductible' : 'collectée'}`,
          // TVA déductible (achats) -> DÉBIT, TVA collectée (ventes) -> CRÉDIT
          debit: isAchat ? facture.total_tva : 0,    // Achats: débit, Ventes: 0
          credit: isAchat ? 0 : facture.total_tva,   // Achats: 0, Ventes: crédit
          devise: facture.devise || 'MGA',
          taux_change: facture.taux_change || 1,
          reference: facture.numero_facture.toString()
        });
      }

      // ÉCRITURE 3: PRODUIT/CHARGE
      ecritures.push({
        numero_ecriture: `${prefix}-${facture.numero_facture}-3`,
        date: facture.date,
        journal: journal,
        compte: compteProduit.numero_compte,
        libelle: `Facture ${facture.numero_facture} - ${isAchat ? 'Achat' : 'Vente'} HT`,
        // Charges (achats) -> DÉBIT, Produits (ventes) -> CRÉDIT
        debit: isAchat ? facture.total_ht : 0,    // Achats: débit, Ventes: 0
        credit: isAchat ? 0 : facture.total_ht,   // Achats: 0, Ventes: crédit
        devise: facture.devise || 'MGA',
        taux_change: facture.taux_change || 1,
        reference: facture.numero_facture.toString()
      });
      
      // CRÉATION DES ÉCRITURES
      console.log(`📊 Création de ${ecritures.length} écritures pour facture ${facture.numero_facture}`);
      for (const ecriture of ecritures) {
        await this.ecritureRepo.create(ecriture);
        console.log(`✅ Écriture créée: ${ecriture.numero_ecriture} - ${ecriture.compte} - ${ecriture.debit > 0 ? 'Débit' : 'Crédit'}: ${ecriture.debit || ecriture.credit}`);
      }
      
      console.log(`🎉 Écritures générées avec succès pour facture ${facture.numero_facture}`);
      return ecritures;
            
    } catch (error) {
      console.error('❌ Erreur génération écritures:', error);
      throw error;
    }
  }

  // MÉTHODE POUR RÉCUPÉRER LE TYPE DE TIERS
  async getTypeTiers(id_tiers) {
    try {
      const tiers = await this.tiersRepo.findById(id_tiers);
      return tiers ? tiers.type_tiers : 'client';
    } catch (error) {
      console.error('❌ Erreur récupération type tiers:', error);
      try {
        const tiers = await db('tiers')
          .where('id_tiers', id_tiers)
          .select('type_tiers')
          .first();
        return tiers ? tiers.type_tiers : 'client';
      } catch (dbError) {
        console.error('❌ Erreur DB récupération type tiers:', dbError);
        return 'client';
      }
    }
  }

  async genererEcriturePaiement(paiement) {
  try {
    console.log('💰 Génération écriture pour paiement:', paiement.id_paiement);
    
    const date = new Date();
    const prefix = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;

    const compte = await this.getCompteByModePaiement(paiement.mode_paiement);
    
   
    const journal = compte === '530000' ? 'caisse' : 'banque';
    
    const ecriture = {
      numero_ecriture: `${prefix}-PAY-${paiement.id_paiement}`,
      date: paiement.date_paiement,
      journal: journal,  
      compte: compte,
      libelle: `Paiement ${paiement.reference || paiement.id_paiement} - ${paiement.mode_paiement}`,
      debit: paiement.montant,
      credit: 0,
      devise: paiement.devise,
      taux_change: paiement.taux_change,
      reference: `PAY-${paiement.id_paiement}`
    };

    const result = await this.ecritureRepo.create(ecriture);
    console.log(`✅ Écriture paiement créée: ${ecriture.numero_ecriture} (journal: ${journal}, compte: ${compte})`);
    return result;
    
  } catch (error) {
    console.error('❌ Erreur génération écriture paiement:', error);
    throw error;
  }
}

  async getCompteByModePaiement(mode_paiement) {
  try {
    console.log(`🔍 DEBUG getCompteByModePaiement: mode=${mode_paiement}`);
    
    const mapping = {
      'espece': 'caisse',      // sans accent
      'espèce': 'caisse',      // avec accent ✅ CORRECTION
      'virement': 'banque',
      'cheque': 'banque', 
      'chèque': 'banque',      // avec accent
      'carte': 'banque'
    };
    
    const categorie = mapping[mode_paiement] || 'banque';
    console.log(`🔍 DEBUG: categorie recherchée = ${categorie}`);
    
    const compte = await this.planComptableRepo.findByCategorie(categorie);
    console.log(`🔍 DEBUG: compte trouvé =`, compte ? compte.numero_compte : 'NULL');
    
    if (!compte) {
      console.warn(`⚠️ Compte non trouvé pour catégorie: ${categorie}, utilisation du fallback 512000`);
      return '512000';
    }
    
    console.log(`🔍 DEBUG: retourne compte ${compte.numero_compte}`);
    return compte.numero_compte;
    
  } catch (error) {
    console.error('❌ Erreur récupération compte paiement:', error);
    return '512000';
  }
}

  async verifierConfiguration() {
    try {
      const comptesRequises = ['client', 'fournisseur', 'tva', 'achat', 'vente', 'banque', 'caisse'];
      const resultats = {};
      
      for (const categorie of comptesRequises) {
        const compte = await this.planComptableRepo.findByCategorie(categorie);
        resultats[categorie] = compte ? {
          numero: compte.numero_compte,
          libelle: compte.libelle,
          ok: true
        } : {
          ok: false,
          erreur: `Compte manquant pour la catégorie: ${categorie}`
        };
      }
      
      // VÉRIFICATION SPÉCIFIQUE DES COMPTES TVA
      const comptesTVA = ['445620', '445600', '445710', '445700'];
      resultats.tva_details = {};
      
      for (const numeroCompte of comptesTVA) {
        const compte = await this.planComptableRepo.findByNumero(numeroCompte);
        resultats.tva_details[numeroCompte] = compte ? {
          libelle: compte.libelle,
          present: true
        } : {
          present: false
        };
      }
      
      return resultats;
    } catch (error) {
      console.error('❌ Erreur vérification configuration:', error);
      throw error;
    }
  }

  // NOUVELLE MÉTHODE : RÉGÉNÉRER LES ÉCRITURES D'UNE FACTURE
  async regenererEcrituresFacture(numero_facture) {
    try {
      console.log(`🔄 Régénération des écritures pour facture ${numero_facture}`);
      
      // Supprimer les anciennes écritures
      await this.ecritureRepo.deleteByFacture(numero_facture);
      console.log(`✅ Anciennes écritures supprimées pour facture ${numero_facture}`);
      
      // Récupérer la facture
      const facture = await this.factureRepo.findById(numero_facture);
      if (!facture) {
        throw new Error(`Facture ${numero_facture} non trouvée`);
      }
      
      // Régénérer les écritures
      return await this.genererEcritureFacture(facture);
      
    } catch (error) {
      console.error(`❌ Erreur régénération écritures facture ${numero_facture}:`, error);
      throw error;
    }
  }
}