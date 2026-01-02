import { TiersRepository } from '../repositories/TiersRepository.js';
import { ArticleRepository } from '../repositories/ArticleRepository.js';
import { FactureRepository } from '../repositories/FactureRepository.js';
import { LigneFactureRepository } from '../repositories/LigneFactureRepository.js';
import { CalculService } from './CalculService.js';
import { ArticleService } from './ArticleService.js';
import { PaiementRepository } from '../repositories/PaiementRepository.js';

export class FacturationService {
  constructor() {
    this.tiersRepository = new TiersRepository();
    this.articleRepository = new ArticleRepository();
    this.factureRepository = new FactureRepository();
    this.ligneFactureRepository = new LigneFactureRepository();
    this.calculService = new CalculService();
    this.articleService = new ArticleService();
    this.paiementRepository = new PaiementRepository(); 
  }

  async verifierStockAvantCreation(factureData) {
  const lignes = factureData.lignes || [];
  const erreurs = [];

  for (const ligne of lignes) {
    if (!ligne.code_article) continue;

    try {
      const article = await this.articleService.getArticleByCode(ligne.code_article);
      
      if (article && article.statut_stock === 'rupture') {
        erreurs.push(`Article ${ligne.code_article} en rupture de stock`);
      }

      if (article && article.quantite_stock < ligne.quantite) {
        erreurs.push(
          `Stock insuffisant pour ${ligne.code_article}: ` +
          `${ligne.quantite} demandé, ${article.quantite_stock} disponible`
        );
      }
    } catch (error) {
      erreurs.push(`Erreur vérification ${ligne.code_article}: ${error.message}`);
    }
  }

  return erreurs;
}

  // Créer une facture complète avec ses lignes - VERSION MULTI-DEVISE

  async validerFacture(numero_facture) {
  try {
    const facture = await this.factureRepository.findById(numero_facture);
    
    if (!facture) {
      throw new Error('Facture non trouvée');
    }

    if (facture.statut === 'validee') {
      throw new Error('La facture est déjà validée');
    }

    const lignes = await this.ligneFactureRepository.findByFacture(numero_facture);
    if (lignes.length === 0) {
      throw new Error('Impossible de valider une facture sans lignes');
    }

    
    await this.verifierStockFacture(lignes);
    await this.decrementerStockFacture(lignes, numero_facture);

    // Marquer la facture comme validée
    await this.factureRepository.valider(numero_facture);

    const factureValidee = await this.factureRepository.findById(numero_facture);
    
    return {
      ...factureValidee,
      lignes,
      statut: 'validee'
    };

  } catch (error) {
    console.error('Erreur FacturationService.validerFacture:', error);
    throw new Error(`Erreur lors de la validation de la facture: ${error.message}`);
  }
}

  // AJOUT: Vérifier le stock avant validation
  async verifierStockFacture(lignes) {
    const erreurs = [];

    for (const ligne of lignes) {
      if (!ligne.code_article) continue; // Ignorer les lignes sans article

      try {
        const article = await this.articleService.getArticleByCode(ligne.code_article);
        
        if (!article) {
          erreurs.push(`Article ${ligne.code_article} non trouvé`);
          continue;
        }

        // Vérifier si l'article est en rupture
        if (article.statut_stock === 'rupture') {
          erreurs.push(`Article ${ligne.code_article} est en rupture de stock`);
        }

        // Vérifier si la quantité demandée dépasse le stock disponible
        const stockDisponible = article.quantite_stock || 0;
        if (stockDisponible < ligne.quantite) {
          erreurs.push(
            `Stock insuffisant pour ${ligne.code_article}: ` +
            `${ligne.quantite} demandé, ${stockDisponible} disponible`
          );
        }
      } catch (error) {
        erreurs.push(`Erreur vérification ${ligne.code_article}: ${error.message}`);
      }
    }

    if (erreurs.length > 0) {
      throw new Error(`Problèmes de stock: ${erreurs.join(', ')}`);
    }
  }

  // AJOUT: Décrémenter le stock après validation
  async decrementerStockFacture(lignes, numero_facture) {
    try {
      for (const ligne of lignes) {
        if (!ligne.code_article) continue; // Ignorer les lignes sans article

        await this.articleService.adjustStock(
          ligne.code_article,
          -ligne.quantite, // Négatif pour décrémenter
          `Vente facture ${numero_facture}`
        );
        
        console.log(`✅ Stock décrémenté: ${ligne.code_article} -${ligne.quantite}`);
      }
    } catch (error) {
      console.error('Erreur lors de la décrémentation du stock:', error);
      throw new Error(`Erreur stock: ${error.message}`);
    }
  }

  // AJOUT: Annuler une facture et réapprovisionner le stock
  async annulerFacture(numero_facture) {
  try {
    const facture = await this.factureRepository.findById(numero_facture);
    
    if (!facture) {
      throw new Error('Facture non trouvée');
    }

    if (facture.statut !== 'validee') {
      throw new Error('Seules les factures validées peuvent être annulées');
    }

    const lignes = await this.ligneFactureRepository.findByFacture(numero_facture);

    
    await this.reapprovisionnerStockFacture(lignes, numero_facture);

    // Marquer la facture comme annulée
    await this.factureRepository.update(numero_facture, {
      statut: 'annulee',
      updated_at: new Date()
    });

    const factureAnnulee = await this.factureRepository.findById(numero_facture);
    
    return {
      ...factureAnnulee,
      lignes,
      statut: 'annulee'
    };

  } catch (error) {
    console.error('Erreur FacturationService.annulerFacture:', error);
    throw new Error(`Erreur lors de l'annulation de la facture: ${error.message}`);
  }
}


  // AJOUT: Réapprovisionner le stock lors de l'annulation
  async reapprovisionnerStockFacture(lignes, numero_facture) {
    try {
      for (const ligne of lignes) {
        if (!ligne.code_article) continue;

        await this.articleService.adjustStock(
          ligne.code_article,
          ligne.quantite, // Positif pour réapprovisionner
          `Annulation facture ${numero_facture}`
        );
        
        console.log(`✅ Stock réapprovisionné: ${ligne.code_article} +${ligne.quantite}`);
      }
    } catch (error) {
      console.error('Erreur lors du réapprovisionnement du stock:', error);
      throw new Error(`Erreur stock: ${error.message}`);
    }
  }
 async creerFacture(factureData) {
  try {
    // Vérifier que le tiers existe
    const tiers = await this.tiersRepository.findById(factureData.id_tiers);
    if (!tiers) {
      throw new Error('Tiers non trouvé');
    }

    // ✅ Vérification du stock UNIQUEMENT si création directe en statut "validée"
    if (factureData.statut === 'validee') {
      const erreursStock = await this.verifierStockAvantCreation(factureData);
      if (erreursStock.length > 0) {
        throw new Error(`Problèmes de stock: ${erreursStock.join(', ')}`);
      }
    }

    // Générer le numéro de facture
    const numero_facture = await this.factureRepository.getNextNumero();

    // NOUVEAUX CHAMPS PAIEMENT FLEXIBLE
    const typePaiement = factureData.type_paiement || 'comptant';
    const totalTTC = factureData.total_ttc || 0;
    
    // Configuration automatique pour le paiement flexible
    let configPaiement = {
      statut_paiement: 'non_paye',
      type_paiement: typePaiement,
      montant_paye: 0,
      montant_restant: totalTTC,
      penalite_retard: factureData.penalite_retard || 0
    };

    // Configuration spécifique selon le type de paiement
    if (typePaiement === 'flexible') {
      // Date finale par défaut : 30 jours si non spécifiée
      const dateFinale = factureData.date_finale_paiement 
        ? new Date(factureData.date_finale_paiement)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // +30 jours
      
      // Montant minimum par défaut : 10% du total ou 1000 MGA
      const montantMinimum = factureData.montant_minimum_paiement 
        || Math.max(totalTTC * 0.1, 1000);

      configPaiement = {
        ...configPaiement,
        date_finale_paiement: dateFinale.toISOString().split('T')[0],
        montant_minimum_paiement: montantMinimum
      };
    } 
    else if (typePaiement === 'echeance') {
      // Paiement à échéance unique
      if (factureData.date_finale_paiement) {
        configPaiement.date_finale_paiement = factureData.date_finale_paiement;
      }
    }
    else if (typePaiement === 'acompte') {
      // Paiement avec acompte
      const montantAcompte = factureData.montant_acompte || 0;
      configPaiement.montant_paye = montantAcompte;
      configPaiement.montant_restant = totalTTC - montantAcompte;
      
      if (montantAcompte > 0) {
        configPaiement.statut_paiement = 'partiellement_payee';
      }
    }

    const facture = {
      numero_facture,
      date: factureData.date || new Date().toISOString().split('T')[0],
      type_facture: factureData.type_facture,
      id_tiers: factureData.id_tiers,
      echeance: factureData.echeance,
      reglement: factureData.reglement,
      statut: factureData.statut || 'brouillon',
      total_ht: factureData.total_ht || 0,
      total_tva: factureData.total_tva || 0,
      total_ttc: totalTTC,
      devise: factureData.devise || 'MGA',
      taux_change: factureData.taux_change || 1.0,
      notes: factureData.notes || null,
      // INTÉGRATION DES CHAMPS PAIEMENT FLEXIBLE
      ...configPaiement
    };

    // Créer la facture
    const nouvelleFacture = await this.factureRepository.create(facture);

    // Traiter les lignes de facture
    const lignesAvecCalculs = await this.processLignesFacture(
      numero_facture, 
      factureData.lignes || [],
      factureData.devise || 'MGA'
    );

    // Si les totaux n'étaient pas fournis, les calculer
    if (!factureData.total_ht || !factureData.total_tva || !factureData.total_ttc) {
      const totaux = this.calculService.calculerTotauxFacture(lignesAvecCalculs);
      
      await this.factureRepository.updateTotals(numero_facture, {
        totalHT: totaux.totalHT,
        totalTVA: totaux.totalTVA, 
        totalTTC: totaux.totalTTC
      });

      // Mettre à jour aussi le montant restant si le total TTC a changé
      if (totaux.totalTTC !== totalTTC) {
        await this.factureRepository.update(numero_facture, {
          montant_restant: totaux.totalTTC - configPaiement.montant_paye
        });
      }
    }

    // ✅ Décrémenter le stock UNIQUEMENT si création directe en statut "validée"
    if (factureData.statut === 'validee') {
      const lignes = await this.ligneFactureRepository.findByFacture(numero_facture);
      await this.decrementerStockFacture(lignes, numero_facture);
    }

    // ENREGISTRER L'ACOMPTE SI PRÉSENT
    if (typePaiement === 'acompte' && factureData.montant_acompte > 0) {
      await this.enregistrerPaiement({
        numero_facture: numero_facture,
        montant: factureData.montant_acompte,
        mode_paiement: factureData.mode_paiement_acompte || 'especes',
        reference: factureData.reference_acompte,
        date_paiement: factureData.date_paiement_acompte || new Date().toISOString().split('T')[0],
        notes: 'Acompte versé à la création de la facture'
      });
    }

    // Récupérer la facture complète avec historique des paiements
    const factureComplete = await this.factureRepository.findById(numero_facture);
    const lignes = await this.ligneFactureRepository.findByFacture(numero_facture);
    const historiquePaiements = await this.getHistoriquePaiements(numero_facture);

    return {
      ...factureComplete,
      lignes,
      historique_paiements: historiquePaiements,
      resume_paiement: {
        type_paiement: configPaiement.type_paiement,
        montant_total: factureComplete.total_ttc,
        montant_paye: configPaiement.montant_paye,
        montant_restant: configPaiement.montant_restant,
        prochain_paiement_minimum: configPaiement.montant_minimum_paiement || 0,
        date_limite: configPaiement.date_finale_paiement
      }
    };

  } catch (error) {
    console.error('Erreur FacturationService.creerFacture:', error);
    throw new Error(`Erreur lors de la création de la facture: ${error.message}`);
  }
}

  // Traiter les lignes de facture avec support multi-devise
  async processLignesFacture(numero_facture, lignes, deviseFacture = 'MGA') {
    const lignesTraitees = [];

    for (const ligne of lignes) {
      let article = null;
      
      if (ligne.code_article) {
        article = await this.articleRepository.findByCode(ligne.code_article);
        if (!article) {
          throw new Error(`Article ${ligne.code_article} non trouvé`);
        }
      }

      // Les prix unitaires sont dans la devise de la facture
      const ligneData = {
        numero_facture,
        code_article: ligne.code_article,
        description: ligne.description || (article ? article.description : ''),
        quantite: ligne.quantite,
        prix_unitaire: ligne.prix_unitaire || (article ? article.prix_unitaire : 0),
        taux_tva: ligne.taux_tva || (article ? article.taux_tva : 20),
        remise: ligne.remise || 0
      };

      const montants = this.calculService.calculerLigneFacture(ligneData);
      
      const ligneComplete = {
        ...ligneData,
        ...montants
      };

      await this.ligneFactureRepository.create(ligneComplete);
      lignesTraitees.push(ligneComplete);
    }

    return lignesTraitees;
  }

  // Valider une facture
  

  // Récupérer une facture complète avec ses lignes
  async getFactureComplete(numeroFacture) {
  try {
    const facture = await this.factureRepository.findById(numeroFacture);
    if (!facture) {
      throw new Error('Facture non trouvée');
    }

    // Récupérer les lignes de facture
    const lignes = await this.ligneFactureRepository.findByFacture(numeroFacture);
    
    // Récupérer les informations du tiers
    let infosTiers = {};
    if (facture.id_tiers) {
      try {
        const tiers = await this.tiersRepository.findById(facture.id_tiers);
        if (tiers) {
          infosTiers = {
            nom_tiers: tiers.nom,
            email: tiers.email,
            telephone: tiers.telephone,
            adresse: tiers.adresse,
            type_tiers: tiers.type_tiers
          };
        }
      } catch (error) {
        console.warn(`⚠️ Tiers ${facture.id_tiers} non trouvé pour facture ${numeroFacture}`);
      }
    }

    // Récupérer les paiements
    const paiements = await this.paiementRepository.findByFacture(numeroFacture);

    return {
      ...facture,
      ...infosTiers,
      lignes,
      paiements,
      montant_paye: paiements.reduce((total, p) => total + parseFloat(p.montant || 0), 0),
      montant_restant: parseFloat(facture.total_ttc || 0) - paiements.reduce((total, p) => total + parseFloat(p.montant || 0), 0)
    };

  } catch (error) {
    console.error('❌ Erreur récupération facture complète:', error);
    throw error;
  }
}

  // Récupérer une facture (alias de getFactureById pour compatibilité)
  async getFacture(numero_facture) {
    try {
      return await this.getFactureById(numero_facture);
    } catch (error) {
      console.error('❌ Erreur getFacture:', error);
      throw error;
    }
  }

  // Récupérer toutes les factures
 async getFactures() {
  try {
    const factures = await this.factureRepository.findAll();
    
    // Joindre les informations des tiers
    const facturesAvecTiers = await Promise.all(
      factures.map(async (facture) => {
        if (facture.id_tiers) {
          try {
            const tiers = await this.tiersRepository.findById(facture.id_tiers);
            return {
              ...facture,
              nom_tiers: tiers?.nom || 'Tiers inconnu',
              email: tiers?.email || null,
              // Ajouter d'autres champs du tiers si nécessaire
              telephone: tiers?.telephone || null,
              adresse: tiers?.adresse || null
            };
          } catch (error) {
            console.warn(`⚠️ Impossible de récupérer le tiers ${facture.id_tiers} pour la facture ${facture.numero_facture}`);
            return {
              ...facture,
              nom_tiers: 'Tiers inconnu',
              email: null
            };
          }
        }
        return {
          ...facture,
          nom_tiers: 'Tiers non spécifié', 
          email: null
        };
      })
    );

    return facturesAvecTiers;
  } catch (error) {
    console.error('❌ Erreur récupération factures:', error);
    throw error;
  }
}


  // Récupérer une facture par ID
  async getFactureById(numero_facture) {
    try {
      const facture = await this.factureRepository.findById(numero_facture);
      
      if (!facture) {
        throw new Error('Facture non trouvée');
      }

      return facture;
    } catch (error) {
      console.error('Erreur FacturationService.getFactureById:', error);
      throw new Error(`Erreur lors de la récupération de la facture: ${error.message}`);
    }
  }

  // Mettre à jour une facture 
 async updateFacture(numeroFacture, factureData) {
  try {
    const factureExistante = await this.getFacture(numeroFacture);
    if (!factureExistante) {
      throw new Error('Facture non trouvée');
    }

    const { lignes, ...factureUpdate } = factureData;

    // ✅ Gestion spéciale du changement de statut
    if (factureUpdate.statut) {
      await this.gererChangementStatut(numeroFacture, factureExistante.statut, factureUpdate.statut, lignes);
    }

    const factureModifiee = await this.factureRepository.update(numeroFacture, factureUpdate);

    if (lignes && Array.isArray(lignes)) {
      await this.ligneFactureRepository.deleteByFacture(numeroFacture);
      await this.processLignesFacture(numeroFacture, lignes, factureData.devise || 'MGA');
    }

    await this.calculerTotalsFacture(numeroFacture);

    return await this.getFactureComplete(numeroFacture);

  } catch (error) {
    console.error('❌ Erreur FacturationService.updateFacture:', error);
    throw new Error('Erreur lors de la mise à jour de la facture: ' + error.message);
  }
}

async gererChangementStatut(numeroFacture, ancienStatut, nouveauStatut, lignes) {
  // Cas 1: Brouillon → Validée : Décrémenter le stock
  if (ancienStatut === 'brouillon' && nouveauStatut === 'validee') {
    const lignesFacture = lignes || await this.ligneFactureRepository.findByFacture(numeroFacture);
    await this.verifierStockFacture(lignesFacture);
    await this.decrementerStockFacture(lignesFacture, numeroFacture);
  }
  
  // Cas 2: Validée → Annulée : Réapprovisionner le stock
  else if (ancienStatut === 'validee' && nouveauStatut === 'annulee') {
    const lignesFacture = lignes || await this.ligneFactureRepository.findByFacture(numeroFacture);
    await this.reapprovisionnerStockFacture(lignesFacture, numeroFacture);
  }
  
  // Cas 3: Annulée → Validée : Décrémenter à nouveau le stock
  else if (ancienStatut === 'annulee' && nouveauStatut === 'validee') {
    const lignesFacture = lignes || await this.ligneFactureRepository.findByFacture(numeroFacture);
    await this.verifierStockFacture(lignesFacture);
    await this.decrementerStockFacture(lignesFacture, numeroFacture);
  }
  
  // Autres cas (Brouillon → Annulée, etc.) : Aucun impact sur le stock
}

  // Calculer les totaux d'une facture 
  async calculerTotalsFacture(numero_facture) {
    try {
      const lignes = await this.ligneFactureRepository.findByFacture(numero_facture);
      
      let totalHT = 0;
      let totalTVA = 0;
      let totalTTC = 0;

      for (const ligne of lignes) {
        totalHT += parseFloat(ligne.montant_ht) || 0;
        totalTVA += parseFloat(ligne.montant_tva) || 0;
        totalTTC += parseFloat(ligne.montant_ttc) || 0;
      }


      const result = await this.factureRepository.updateTotals(numero_facture, {
        totalHT: totalHT,
        totalTVA: totalTVA,
        totalTTC: totalTTC
      });

      return { totalHT, totalTVA, totalTTC };
      
    } catch (error) {
      console.error('❌ Erreur calculTotalsFacture:', error);
      throw error;
    }
  }

  async enregistrerPaiement(paiementData) {
    try {
      const { numero_facture, montant, mode_paiement, reference, date_paiement } = paiementData;
      
      // Vérifier la facture
      const facture = await this.factureRepository.findById(numero_facture);
      if (!facture) {
        throw new Error('Facture non trouvée');
      }

      // Vérifier le montant minimum pour les paiements flexibles
      if (facture.type_paiement === 'partiel' || facture.type_paiement === 'flexible') {
        const montantMinimum = facture.montant_minimum_paiement || 0;
        if (montant < montantMinimum && montant < facture.montant_restant) {
          throw new Error(`Montant insuffisant. Minimum requis: ${montantMinimum}`);
        }
      }

      // Vérifier que le montant ne dépasse pas le reste à payer
      if (montant > facture.montant_restant) {
        throw new Error(`Montant trop élevé. Reste à payer: ${facture.montant_restant}`);
      }

      // Créer l'enregistrement de paiement
      const paiement = {
        numero_facture,
        montant,
        mode_paiement: mode_paiement || 'espèce',
        reference: reference || null,
        date_paiement: date_paiement || new Date()
      };

      const paiementCree = await this.paiementRepository.create(paiement);

      // Mettre à jour la facture
      const factureMaj = await this.factureRepository.mettreAJourPaiement(numero_facture, montant);

      return {
        paiement: paiementCree,
        facture: factureMaj
      };

    } catch (error) {
      console.error('Erreur FacturationService.enregistrerPaiement:', error);
      throw new Error(`Erreur lors de l'enregistrement du paiement: ${error.message}`);
    }
  }

  // NOUVELLE MÉTHODE : Configurer le paiement flexible
  async configurerPaiementFlexible(numero_facture, config) {
    try {
      const facture = await this.factureRepository.findById(numero_facture);
      if (!facture) {
        throw new Error('Facture non trouvée');
      }

      const configPaiement = {
        type_paiement: config.type_paiement || 'flexible',
        date_finale_paiement: config.date_finale_paiement,
        montant_minimum_paiement: config.montant_minimum_paiement || 0,
        penalite_retard: config.penalite_retard || 0
      };

      // Calculer le montant minimum si non spécifié (10% par défaut)
      if (!config.montant_minimum_paiement) {
        configPaiement.montant_minimum_paiement = Math.max(
          facture.total_ttc * 0.1, // 10% du total
          1000 // Minimum absolu
        );
      }

      const factureMaj = await this.factureRepository.update(numero_facture, configPaiement);
      return factureMaj;

    } catch (error) {
      console.error('Erreur FacturationService.configurerPaiementFlexible:', error);
      throw new Error(`Erreur lors de la configuration du paiement: ${error.message}`);
    }
  }

  // NOUVELLE MÉTHODE : Calculer les pénalités de retard
  async calculerPenalites(numero_facture) {
    try {
      const facture = await this.factureRepository.findById(numero_facture);
      if (!facture) {
        throw new Error('Facture non trouvée');
      }

      if (facture.statut_paiement !== 'en_retard') {
        return { penalites: 0, jours_retard: 0 };
      }

      const aujourdhui = new Date();
      const dateFinale = new Date(facture.date_finale_paiement);
      const joursRetard = Math.max(0, Math.floor((aujourdhui - dateFinale) / (1000 * 60 * 60 * 24)));
      
      const penalitesMensuelles = (facture.montant_restant * facture.penalite_retard) / 100;
      const penalites = (penalitesMensuelles / 30) * joursRetard;

      return {
        penalites: Math.round(penalites),
        jours_retard: joursRetard,
        montant_restant: facture.montant_restant,
        taux_penalite: facture.penalite_retard
      };

    } catch (error) {
      console.error('Erreur FacturationService.calculerPenalites:', error);
      throw new Error(`Erreur lors du calcul des pénalités: ${error.message}`);
    }
  }

  // NOUVELLE MÉTHODE : Récupérer l'historique des paiements
  async getHistoriquePaiements(numero_facture) {
    try {
      const facture = await this.factureRepository.findById(numero_facture);
      if (!facture) {
        throw new Error('Facture non trouvée');
      }

      const paiements = await this.paiementRepository.findByFacture(numero_facture);
      
      return {
        facture: {
          numero_facture: facture.numero_facture,
          total_ttc: facture.total_ttc,
          montant_paye: facture.montant_paye,
          montant_restant: facture.montant_restant,
          statut_paiement: facture.statut_paiement
        },
        paiements: paiements,
        resume: {
          total_paye: paiements.reduce((sum, p) => sum + parseFloat(p.montant), 0),
          nombre_paiements: paiements.length,
          premier_paiement: paiements.length > 0 ? paiements[paiements.length - 1].date_paiement : null,
          dernier_paiement: paiements.length > 0 ? paiements[0].date_paiement : null
        }
      };

    } catch (error) {
      console.error('Erreur FacturationService.getHistoriquePaiements:', error);
      throw new Error(`Erreur lors de la récupération de l'historique: ${error.message}`);
    }
  }

  // NOUVELLE MÉTHODE : Vérifier les factures en retard (cron job)
  async verifierFacturesEnRetard() {
    try {
      const facturesEnRetard = await this.factureRepository.findEnRetard();
      const resultats = [];

      for (const facture of facturesEnRetard) {
        // Mettre à jour le statut si nécessaire
        if (facture.statut_paiement !== 'en_retard') {
          await this.factureRepository.update(facture.numero_facture, {
            statut_paiement: 'en_retard'
          });
        }

        // Calculer les pénalités
        const penalites = await this.calculerPenalites(facture.numero_facture);
        
        resultats.push({
          facture: facture.numero_facture,
          client: facture.nom_tiers,
          montant_restant: facture.montant_restant,
          jours_retard: penalites.jours_retard,
          penalites: penalites.penalites
        });
      }

      return resultats;

    } catch (error) {
      console.error('Erreur FacturationService.verifierFacturesEnRetard:', error);
      throw new Error(`Erreur lors de la vérification des retards: ${error.message}`);
    }
  }


  // Générer un numéro de facture
  async genererNumeroFacture() {
    return await this.factureRepository.getNextNumero();
  }
}

export default FacturationService;