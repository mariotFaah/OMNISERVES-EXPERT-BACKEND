🔐 Module d'Authentification - Backend Aquatiko
📋 Table des Matières
Overview

Architecture

API Endpoints

Modèles de Données

Sécurité

Utilisation

🎯 Overview
Le module d'authentification gère l'identité et les accès des utilisateurs dans l'application Aquatiko. Il fournit un système complet de connexion, gestion des rôles et permissions.

🏗️ Architecture
text
src/modules/auth/
├── controllers/
│   ├── AuthController.js      # Gestion connexion/déconnexion
│   └── UserController.js      # CRUD utilisateurs (admin)
├── services/
│   ├── AuthService.js         # Logique métier authentification
│   ├── UserService.js         # Logique métier utilisateurs
│   └── TokenService.js        # Gestion des tokens JWT
├── repositories/
│   └── UserRepository.js      # Accès base de données
├── middleware/
│   ├── authorize.js           # Vérification des rôles
│   └── validation.js          # Validation des données
├── routes/
│   ├── auth.routes.js         # Routes publiques
│   └── users.routes.js        # Routes admin (protégées)
└── validators/
    └── auth.validator.js      # Schémas de validation
🌐 API Endpoints
🔓 Routes Publiques
POST /api/auth/login
Connexion utilisateur

Body:

json
{
  "email": "admin@aquatiko.mg",
  "password": "password123"
}
Réponse:

json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@aquatiko.mg",
      "nom": "Admin",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
POST /api/auth/logout
Déconnexion (symbolique)

GET /api/auth/verify
Vérification token

🔐 Routes Administrateur
Nécessitent le header: Authorization: Bearer <token>

GET /api/auth/users
Lister tous les utilisateurs

Réponse:

json
{
  "success": true,
  "message": "Utilisateurs récupérés avec succès",
  "data": [
    {
      "id": 1,
      "email": "admin@aquatiko.mg",
      "nom": "Admin",
      "prenom": "Principal",
      "role": "admin",
      "nom_role": "Administrateur",
      "is_active": true,
      "last_login": "2025-11-21T09:51:17.000Z",
      "created_at": "2025-11-21T09:51:17.000Z"
    }
  ]
}
POST /api/auth/users
Créer un utilisateur

Body:

json
{
  "email": "nouveau@aquatiko.mg",
  "password": "motdepasse123",
  "nom": "Nouveau",
  "prenom": "Utilisateur",
  "role": "commercial"
}
PUT /api/auth/users/:id
Modifier un utilisateur

Body:

json
{
  "email": "modifie@aquatiko.mg",
  "nom": "Modifié",
  "prenom": "Utilisateur",
  "role": "comptable"
}
PATCH /api/auth/users/:id/deactivate
Désactiver un utilisateur

PATCH /api/auth/users/:id/activate
Réactiver un utilisateur

💾 Modèles de Données
Table users
sql
CREATE TABLE users (
  id_user INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  id_role INT UNSIGNED NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_role) REFERENCES roles(id_role)
);
Table roles
sql
CREATE TABLE roles (
  id_role INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code_role VARCHAR(50) NOT NULL UNIQUE,
  nom_role VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
Rôles Disponibles
admin - Accès complet au système

comptable - Gestion de la comptabilité

commercial - Gestion commerciale et CRM

🔒 Sécurité
JWT Token Structure
javascript
{
  "userId": 1,
  "email": "admin@aquatiko.mg",
  "nom": "Admin",
  "role": "admin",
  "iat": 1763708507,
  "exp": 1764313307
}
Middleware de Protection
Authentification Basique
javascript
import { auth } from '../core/middleware/auth.js';

// Protéger une route
app.get('/api/protected', auth, (req, res) => {
  // req.user contient les données du token
  res.json({ user: req.user });
});
Vérification des Rôles
javascript
import { authorize } from '../modules/auth/middleware/authorize.js';

// Seuls les admins peuvent accéder
app.get('/api/admin/users', auth, authorize('admin'), (req, res) => {
  // Logique admin
});
🚀 Utilisation
Installation et Configuration
Variables d'environnement (.env)

env
JWT_SECRET=votre_secret_jwt_super_securise
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=gestion_entreprise
Exécution des migrations

bash
npx knex migrate:latest
Peuplement des données

bash
npx knex seed:run
Exemples d'Utilisation
Connexion avec cURL
bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aquatiko.mg",
    "password": "password123"
  }'
Gestion utilisateurs (Admin)
bash
# Lister les utilisateurs
curl -X GET http://localhost:3001/api/auth/users \
  -H "Authorization: Bearer <token>"

# Créer un utilisateur
curl -X POST http://localhost:3001/api/auth/users \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@aquatiko.mg",
    "password": "test123",
    "nom": "Test",
    "prenom": "User", 
    "role": "commercial"
  }'
🛠️ Développement
Ajouter un nouveau rôle
Ajouter dans la table roles

Définir les permissions dans role_permissions

Mettre à jour le seed

Gestion des erreurs
Toutes les réponses suivent le format:

json
{
  "success": boolean,
  "message": "Description de l'erreur",
  "data": {} || [] || null
}
Codes HTTP
200 - Succès

201 - Création réussie

400 - Données invalides

401 - Non authentifié

403 - Accès refusé

404 - Ressource non trouvée

500 - Erreur serveur

📞 Support
Pour toute question sur le module d'authentification, contacter l'équipe backend.

*Documentation maintenue par l'équipe Aquatiko - © 2025*

