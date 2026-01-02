// src/modules/comptabilite/routes/index.js
import { Router } from 'express';
import tiersRoutes from './tiers.routes.js';
import articlesRoutes from './articles.routes.js';
import facturesRoutes from './factures.routes.js';
import paiementsRoutes from './paiements.routes.js';
import devisesRoutes from './devises.routes.js';
import rapportsRoutes from './rapports.routes.js';
import ecrituresRoutes from './ecritures.routes.js'; 
import statistiquesRoutes from './statistiques.routes.js';
import referentielsRoutes from './referentiels.routes.js';
import emailRoutes from './email.routes.js';

const router = Router();

// Utiliser les routes modulaires
router.use('/tiers', tiersRoutes);
router.use('/articles', articlesRoutes);
router.use('/factures', facturesRoutes);
router.use('/paiements', paiementsRoutes);
router.use('/devises', devisesRoutes);
router.use('/rapports', rapportsRoutes);
router.use('/ecritures', ecrituresRoutes); 
router.use('/stats', statistiquesRoutes);
router.use('/referentiels', referentielsRoutes); 
router.use('/email', emailRoutes); 

// ✅ NOUVELLE ROUTE - Test d'authentification
router.get('/auth-test', (req, res) => {
  res.json({
    success: true,
    message: 'Test de sécurité du module Comptabilité',
    security: {
      authentification: 'Requis pour la plupart des endpoints',
      permissions: 'Gestion fine par rôle (admin, comptable, commercial, utilisateur)',
      modules_protégés: ['factures', 'paiements', 'ecritures', 'rapports', 'statistiques'],
      modules_partiellement_publics: ['devises', 'referentiels']
    },
    instructions: {
      login: 'POST /api/auth/login',
      test_acces: 'Utiliser le token dans le header Authorization: Bearer <token>'
    }
  });
});

// ✅ ROUTE TEST GLOBALE MISE À JOUR
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Module Comptabilité fonctionnel!',
    data: {
      module: 'Comptabilité',
      version: '2.1.0', // ✅ Version mise à jour
      sécurité: '🔐 Authentification et permissions par rôle',
      entités: [
        'Tiers', 
        'Article', 
        'Facture', 
        'LigneFacture',
        'Paiement',
        'TauxChange',
        'EcritureComptable',
        'PlanComptable',
        'Referentiels',
        'Users', // ✅ Nouveau
        'Roles', // ✅ Nouveau
        'Permissions' // ✅ Nouveau
      ],
      services: [
        'Multi-devises',
        'Suivi des paiements',
        'Journaux comptables',
        'États financiers',
        'Gestion référentiels',
        'Relances email',
        'Authentification sécurisée', // ✅ Nouveau
        'Gestion des permissions' // ✅ Nouveau
      ],
      routes: {
        tiers: '/api/comptabilite/tiers (🔐)',
        articles: '/api/comptabilite/articles (🔐)',
        factures: '/api/comptabilite/factures (🔐)',
        paiements: '/api/comptabilite/paiements (🔐)',
        devises: '/api/comptabilite/devises (🔓 conversion publique)',
        rapports: '/api/comptabilite/rapports (🔐)',
        ecritures: '/api/comptabilite/ecritures (🔐)',
        stats: '/api/comptabilite/stats (🔐)',
        referentiels: '/api/comptabilite/referentiels (🔓 partiellement public)',
        email: '/api/comptabilite/email (🔐)',
        auth_test: '/api/comptabilite/auth-test (🔓)'
      },
      fonctionnalités: {
        'Multi-devises': 'Support EUR, USD, MGA avec taux de change',
        'Types de documents': 'Proforma, Facture, Avoir',
        'Suivi paiements': 'Paiements partiels, échéances, modes de paiement',
        'Journaux': 'Ventes, Achats, Banque, Caisse',
        'États financiers': 'Bilan, Compte de résultat, TVA, Trésorerie',
        'Ecritures comptables': 'Automatiques et manuelles',
        'Statistiques': 'Chiffre d\'affaires, ventes par produit, clients',
        'Plan comptable dynamique': 'Configuration flexible des comptes',
        'Référentiels configurables': 'Modes paiement, types facture, TVA',
        'Relances email': 'Relances automatiques des factures impayées',
        '🔐 Authentification': 'Système de rôles et permissions', // ✅ Nouveau
        '🛡️ Sécurité': 'Protection JWT et contrôle d\'accès' // ✅ Nouveau
      },
      rôles_supportés: {
        'admin': 'Accès complet à tous les modules',
        'comptable': 'Module comptabilité complet',
        'commercial': 'Modules CRM et Import-Export seulement',
        'utilisateur': 'Accès limité en lecture'
      }
    }
  });
});

// ✅ NOUVELLE ROUTE - Santé du module
router.get('/health', (req, res) => {
  res.json({
    success: true,
    module: 'comptabilite',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    sécurité: 'active',
    version: '2.1.0'
  });
});

export default router;