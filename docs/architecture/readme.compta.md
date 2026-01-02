# 📊 Module Comptabilité - Aquatiko
## 🎯 Aperçu Général
Module complet de gestion comptable pour Aquatiko, offrant une solution intégrée de gestion financière multi-devises avec génération automatique d'écritures comptables et gestion dynamique des référentiels.

### 🚀 Statut : PRÊT POUR LA PRODUCTION - Testé et validé à 100%

#### 📋 Table des Matières
Fonctionnalités Principales

Installation et Configuration

Architecture Technique

API Documentation

Base de Données

Exemples d'Utilisation

Tests et Validation

Développement

#### 🌟 Fonctionnalités Principales
**💰 Gestion Multi-devises**
Support complet : EUR, USD, MGA

Taux de change dynamiques avec historique

Conversion automatique entre devises

Gestion des écarts de change

**👥 Gestion des Tiers**
Clients et fournisseurs

Devises préférées par tiers

Adresses et contacts complets

CRUD complet avec validation

**📦 Gestion des Articles et Stock**
```bash
# Statuts de stock disponibles
🟢 EN_STOCK    - Stock suffisant
🟡 FAIBLE_STOCK - Niveau critique
🔴 RUPTURE_STOCK - Stock épuisé
```
# Fonctionnalités stock :

Suivi temps réel des quantités

Alertes automatiques seuil critique

Ajustements manuels et automatiques

Vérification disponibilité avant facturation

🧾 Facturation Avancée
Types de documents : Proforma, Facture, Avoir

Lignes détaillées avec calcul automatique TVA

Gestion des échéances et modes de règlement

Statuts : Brouillon, Validée, Annulée

### 💳 Système de Paiement Flexible 🆕
Types de Paiement Disponibles
```bash 
{
  "comptant": "Paiement immédiat (défaut)",
  "flexible": "Paiements échelonnés avec dates limites", 
  "acompte": "Paiement partiel initial + solde",
  "echeance": "Paiement unique à date fixe"
}
```
Configuration Flexible
```bash
{
  "type_paiement": "flexible",
  "date_finale_paiement": "2024-12-31",
  "montant_minimum_paiement": 10000,
  "penalite_retard": 2.5,
  "montant_acompte": 30000,
  "mode_paiement_acompte": "virement"
}
```
Statuts de Paiement Automatiques
non_paye - Aucun paiement effectué

partiellement_payee - Paiements partiels reçus

payee - Intégralité payée

en_retard - Date limite dépassée avec solde

📊 Écritures Comptables Automatiques
Génération automatique à la validation des factures

Journaux : Ventes, Achats, Banque, Caisse

Plan comptable 100% configurable

Référencement complet des opérations

📈 Rapports Financiers
Bilan comptable avec soldes par compte

Compte de résultat (charges/produits)

Déclaration TVA collectée/déductible

État de trésorerie (entrées/sorties)

🔧 Gestion des Référentiels Dynamiques
Plan comptable - Configuration flexible des comptes

Modes de paiement - Personnalisables

Types de documents - Extensibles

Taux de TVA - Modifiables

🛠️ Installation et Configuration
Prérequis
Node.js 16+

MySQL / MariaDB

npm ou yarn

Installation Pas à Pas
```bash
# 1. Cloner le projet
git clone https://github.com/mariotFaah/aquatiko_v2
cd aquatiko/backend

# 2. Installer les dépendances
npm install

# 3. Configuration de la base de données
cp .env.example .env
# Éditez le fichier .env avec vos paramètres

# 4. Exécuter les migrations
npm run migrate

# 5. Peupler avec des données de test
npm run seed

# 6. Démarrer le serveur
npm run dev
```
Fichier .env Exemple
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=gestion_entreprise

SERVER_PORT=3001
NODE_ENV=development
```
🏗️ Architecture Technique
Structure du Module
```bash
src/modules/comptabilite/
├── controllers/           # Contrôleurs API
│   ├── TiersController.js
│   ├── ArticleController.js
│   ├── FactureController.js
│   ├── PaiementController.js
│   ├── RapportController.js
│   ├── StatistiqueController.js
│   └── ReferentielController.js
├── services/             # Logique métier
│   ├── FacturationService.js
│   ├── PaiementService.js
│   ├── JournalService.js
│   ├── RapportService.js
│   ├── StatistiqueService.js
│   └── ReferentielService.js
├── repositories/         # Accès aux données
│   ├── TiersRepository.js
│   ├── ArticleRepository.js
│   ├── FactureRepository.js
│   └── PaiementRepository.js
├── entities/             # Modèles de données
├── routes/               # Définition des routes
├── validators/           # Validation des données
└── index.js              # Point d'entrée du module
```

Services Principaux
Service	Responsabilité
FacturationService	Gestion du cycle de vie des factures
PaiementService	Gestion des transactions et statuts
JournalService	Génération d'écritures comptables
RapportService	Calculs financiers et rapports
StatistiqueService	Métriques et indicateurs KPI
ReferentielService	Gestion des données de référence
Flow de Données
```bash
Facture → Validation → Écritures Comptables → Paiements → Statuts Automatiques
```

🌐 API Documentation
Base URL : http://localhost:3001/api/comptabilite

📋 Tiers (Clients/Fournisseurs)
Méthode	Endpoint	Description
GET	/tiers	Liste tous les tiers
GET	/tiers/:id	Détail d'un tiers
POST	/tiers	Créer un tiers
PUT	/tiers/:id	Modifier un tiers
DELETE	/tiers/:id	Supprimer un tiers
📦 Articles et Stock
Méthode	Endpoint	Description
GET	/articles	Liste tous les articles
GET	/articles/:code	Détail d'un article
POST	/articles	Créer un article
PUT	/articles/:code	Modifier un article
PATCH	/articles/:code/stock/adjust	Ajuster le stock
GET	/articles/alertes/stock	Alertes de stock critique
🧾 Factures
Méthode	Endpoint	Description
GET	/factures	Liste toutes les factures
GET	/factures/:id	Détail d'une facture
POST	/factures	Créer une facture
PATCH	/factures/:id/valider	Valider une facture
💳 Paiements
Méthode	Endpoint	Description
GET	/paiements	Liste tous les paiements
POST	/paiements	Enregistrer un paiement
GET	/paiements/facture/:id	Paiements d'une facture
📊 Rapports
Méthode	Endpoint	Description
GET	/rapports/bilan	Bilan comptable
GET	/rapports/compte-resultat	Compte de résultat
GET	/rapports/tva	Déclaration TVA
GET	/rapports/tresorerie	État de trésorerie
📈 Statistiques
Méthode	Endpoint	Description
GET	/stats/indicateurs	Indicateurs généraux
GET	/stats/chiffre-affaire	CA par période
GET	/stats/top-clients	Top 10 clients
GET	/stats/top-produits	Top 10 produits
🔧 Référentiels
Méthode	Endpoint	Description
GET	/referentiels/plan-comptable	Plan comptable
GET	/referentiels/modes-paiement	Modes de paiement
GET	/referentiels/types-facture	Types de facture
GET	/referentiels/taux-tva	Taux de TVA
💾 Base de Données
Tables Principales
Table	Description
tiers	Clients et fournisseurs
articles	Produits et services avec stock
factures	En-têtes des factures
ligne_facture	Lignes détaillées des factures
paiements	Transactions financières
ecritures_comptables	Écritures comptables
taux_change	Taux de conversion
Tables de Référence
Table	Description
plan_comptable	Plan comptable configurable
referentiel_types_facture	Types de documents
referentiel_modes_paiement	Modes de paiement
referentiel_taux_tva	Taux de TVA applicables
Plan Comptable Dynamique (Exemple)
```bash
401000 - Fournisseurs
411000 - Clients
445620 - TVA déductible
445710 - TVA collectée
512000 - Banque
530000 - Caisse
607000 - Achats de marchandises
701000 - Ventes de produits
```
Trigger MySQL pour Paiements Automatiques
```bash
CREATE TRIGGER after_paiement_insert 
AFTER INSERT ON paiements
FOR EACH ROW
BEGIN
    -- Calcul automatique des statuts
    -- Mise à jour montant_paye, montant_restant
    -- Gestion des retards automatique
END;
```

🎯 Exemples d'Utilisation
Création d'une Facture avec Paiement Flexible
```bash
curl -X POST "http://localhost:3001/api/comptabilite/factures" \
  -H "Content-Type: application/json" \
  -d '{
    "id_tiers": 1,
    "type_facture": "facture",
    "type_paiement": "flexible",
    "date": "2024-01-15",
    "date_finale_paiement": "2024-04-15",
    "montant_minimum_paiement": 15000,
    "lignes": [
      {
        "code_article": "ART001",
        "quantite": 3,
        "prix_unitaire": 50000,
        "taux_tva": 20
      }
    ],
    "statut": "validee"
  }'
```

Enregistrement d'un Paiement
```bash
curl -X POST "http://localhost:3001/api/comptabilite/paiements" \
  -H "Content-Type: application/json" \
  -d '{
    "numero_facture": 1,
    "date_paiement": "2024-01-20",
    "montant": 50000,
    "devise": "MGA",
    "mode_paiement": "virement",
    "reference": "VIR-001",
    "statut": "validé"
  }'
```

Workflow Complet Paiements Échelonnés
```bash
# 1. Création facture flexible
curl -X POST "http://localhost:3001/api/comptabilite/factures" \
  -H "Content-Type: application/json" \
  -d '{
    "id_tiers": 1,
    "type_facture": "facture",
    "type_paiement": "flexible",
    "date_finale_paiement": "2024-06-30",
    "montant_minimum_paiement": 20000,
    "lignes": [{"code_article": "ART001", "quantite": 5, "prix_unitaire": 40000, "taux_tva": 20}]
  }'

# 2. Premier paiement (30%)
curl -X POST "http://localhost:3001/api/comptabilite/paiements" \
  -d '{"numero_facture": 16, "montant": 80000, "mode_paiement": "virement", "reference": "P1"}'

# 3. Deuxième paiement (40%)  
curl -X POST "http://localhost:3001/api/comptabilite/paiements" \
  -d '{"numero_facture": 16, "montant": 100000, "mode_paiement": "espèce", "reference": "P2"}'

# 4. Solde (30%)
curl -X POST "http://localhost:3001/api/comptabilite/paiements" \
  -d '{"numero_facture": 16, "montant": 80000, "mode_paiement": "chèque", "reference": "P3"}'
```
Gestion du Stock
```bash
# Créer un article avec gestion de stock
curl -X POST "http://localhost:3001/api/comptabilite/articles" \
  -H "Content-Type: application/json" \
  -d '{
    "code_article": "ART100",
    "description": "Nouveau Produit",
    "prix_unitaire": 15000,
    "taux_tva": 20,
    "unite": "pièce",
    "quantite_stock": 100,
    "seuil_alerte": 10,
    "actif": true
  }'

# Ajuster le stock
curl -X PATCH "http://localhost:3001/api/comptabilite/articles/ART100/stock/adjust" \
  -H "Content-Type: application/json" \
  -d '{
    "quantite": -5,
    "raison": "Vente client"
  }'
```

Consultation des Référentiels
```bash
# Plan comptable dynamique
curl "http://localhost:3001/api/comptabilite/referentiels/plan-comptable"

# Modes de paiement
curl "http://localhost:3001/api/comptabilite/referentiels/modes-paiement"

# Types de documents
curl "http://localhost:3001/api/comptabilite/referentiels/types-facture"

# Taux de TVA
curl "http://localhost:3001/api/comptabilite/referentiels/taux-tva"
```

🧪 Tests et Validation
Données de Test Incluses
3 clients de test

3 fournisseurs de test

5 articles de test avec stock

Plan comptable complet

Modes de paiement : Espèce, Virement, Chèque, Carte

Types de documents : Proforma, Facture, Avoir

Taux de TVA : 0%, 5%, 10%, 20%

Scripts de Test
```bash
# Test de santé du module
curl "http://localhost:3001/api/comptabilite/test"

# Vérification des écritures
curl "http://localhost:3001/api/comptabilite/ecritures"

# Validation des rapports
curl "http://localhost:3001/api/comptabilite/rapports/bilan"

# Vérification des paiements
curl "http://localhost:3001/api/comptabilite/paiements/facture/1"
```

Tests Automatisés
```bash
# Exécuter tous les tests
npm test

# Tests spécifiques au module comptabilité
npm run test:comptabilite

# Tests avec couverture
npm run test:coverage
```

🔧 Développement
Commandes de Développement
```bash
# Mode développement avec rechargement automatique
npm run dev

# Exécution des migrations
npm run migrate

# Rollback des migrations
npm run migrate:rollback

# Génération de données de test
npm run seed

# Construction pour la production
npm run build
```
Standards de Code
ES6+ modules pour l'import/export

Async/await pour les opérations asynchrones

Validation Joi pour les données d'entrée

Gestion centralisée des erreurs

Logs structurés pour le debugging

Structure des Contrôleurs
```bash
export class MonControleur {
  async maMethode(req, res) {
    try {
      // Validation des données
      const data = await validator.validateAsync(req.body);
      
      // Appel service
      const result = await this.service.traiter(data);
      
      // Réponse standardisée
      res.status(200).json({
        success: true,
        data: result,
        message: 'Opération réussie',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Gestion d'erreur standardisée
      res.status(500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}
```

Ajout de Nouvelles Fonctionnalités
Créer le repository pour l'accès aux données

Développer le service avec la logique métier

Implémenter le contrôleur avec validation

Définir les routes dans le routeur

Ajouter les validators Joi si nécessaire

Tester avec des données réelles

🚀 Déploiement en Production
Checklist Pré-Production
Tests unitaires et d'intégration passants

Validation des données d'entrée

Gestion des erreurs complète

Logs appropriés configurés

Sécurité des endpoints vérifiée

Performance des requêtes optimisée

Variables d'Environnement Production
```bash
NODE_ENV=production
DB_HOST=production-db-host
DB_PORT=3306
DB_USER=production-user
DB_PASSWORD=secure-password
DB_NAME=aquatiko_prod

SERVER_PORT=3001
LOG_LEVEL=info
```

Monitoring et Maintenance
Logs : Consulter les logs d'application régulièrement

Performance : Surveiller les temps de réponse API

Sécurité : Mettre à jour les dépendances régulièrement

Sauvegarde : Backup automatique de la base de données

📞 Support et Maintenance
Documentation Additionnelle
Wiki du projet

Guide d'API détaillé

Guide de déploiement

Problèmes Courants et Solutions
Trigger MySQL non fonctionnel : Vérifier les privilèges utilisateur

Écritures non générées : Vérifier le plan comptable configuré

Statuts non mis à jour : Vérifier le trigger after_paiement_insert

Contact Développement
Pour toute question ou problème concernant ce module, contacter l'équipe de développement Aquatiko.

🎉 Conclusion
✅ Fonctionnalités Validées
✅ Gestion complète tiers et articles

✅ Facturation multi-types avec TVA

✅ Paiements flexibles et échéances

✅ Écritures comptables automatiques

✅ Rapports financiers complets

✅ Statistiques et indicateurs KPI

✅ API REST complète et documentée

✅ Gestion de stock temps réel

✅ Plan comptable 100% dynamique

✅ Référentiels configurables

🚀 Statut Production
Le module est prêt pour la production avec :

Tests complets validés

Documentation exhaustive

Performance optimisée

Sécurité renforcée

Maintenance simplifiée


