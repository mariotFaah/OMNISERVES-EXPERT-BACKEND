## 📦 Documentation du Module Articles & Gestion de Stock
### 🗃️ Structure de la Table articles
#### 📋 Description de la Table
sql
```bash
CREATE TABLE articles (
  code_article VARCHAR(50) PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  prix_unitaire DECIMAL(15,2) NOT NULL,
  taux_tva DECIMAL(5,2) DEFAULT 20.00,
  unite VARCHAR(20) DEFAULT 'unite',
  actif TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  devise VARCHAR(3) DEFAULT 'MGA',
  quantite_stock INT NOT NULL DEFAULT 0,
  seuil_alerte INT NOT NULL DEFAULT 5
);
```

🏷️
#### 🏷️ Champs de la Table
Champ	Type	Obligatoire	Défaut	Description
code_article	VARCHAR(50)	✅	-	Code unique identifiant l'article
description	VARCHAR(255)	✅	-	Nom/description de l'article
prix_unitaire	DECIMAL(15,2)	✅	-	Prix unitaire en MGA
taux_tva	DECIMAL(5,2)	❌	20.00	Taux de TVA (0-100)
unite	VARCHAR(20)	❌	"unite"	Unité de mesure (unite, heure, jour, etc.)
actif	TINYINT(1)	❌	1	Statut actif (1=actif, 0=inactif)
devise	VARCHAR(3)	❌	"MGA"	Devise (MGA, EUR, USD)
quantite_stock	INT	✅	0	Quantité disponible en stock
seuil_alerte	INT	✅	5	Seuil d'alerte pour stock faible

#### 📊 Statuts de Stock Calculés
Le statut de stock est calculé automatiquement :

**Statut	Condition	Description**
🟢 disponible	quantite_stock > seuil_alerte	Stock suffisant
🟡 stock_faible	0 < quantite_stock <= seuil_alerte	Stock critique
🔴 rupture	quantite_stock = 0	Stock épuisé
🔐 Authentification Requise


#### Toutes les requêtes nécessitent un token JWT dans le header :

http
Authorization: Bearer {votre_token_jwt}
👥 Rôles Requis par Endpoint
Endpoint	Rôle Requis	Description
GET /	Aucun	Lecture publique
GET /:code	Aucun	Lecture publique
POST /	comptable ou admin	Création
PUT /:code	comptable ou admin	Modification
DELETE /:code	admin seulement	Suppression
Gestion stock	comptable ou admin	Opérations stock
🌐 Endpoints API Articles
Base URL
text
http://localhost:3001/api/comptabilite/articles

#### 📋 1. LISTER TOUS LES ARTICLES
🔹 GET /
Accès : Public
Description : Récupère la liste complète des articles avec leur statut de stock

Response :

json
```bash
{
  "success": true,
  "message": [
    {
      "code_article": "ART001",
      "description": "Ordinateur Portable",
      "prix_unitaire": "2500000.00",
      "taux_tva": "20.00",
      "unite": "unite",
      "actif": 1,
      "devise": "MGA",
      "quantite_stock": 80,
      "seuil_alerte": 3,
      "statut_stock": "disponible",
      "created_at": "2025-11-21T06:56:16.000Z",
      "updated_at": "2025-11-21T11:22:35.000Z"
    }
  ],
  "data": "Articles récupérés avec succès"
}

```
##### Commande cURL :

```bash
curl -X GET "http://localhost:3001/api/comptabilite/articles" \
  -H "Authorization: Bearer $TOKEN" | jq

 ``` 
#### 👀 2. RÉCUPÉRER UN ARTICLE SPÉCIFIQUE
🔹 GET /:code
Accès : Public
Paramètre : code - Code de l'article (ex: ART001)

Response 
```bash
json
{
  "success": true,
  "message": {
    "code_article": "ART001",
    "description": "Ordinateur Portable",
    "prix_unitaire": "2500000.00",
    "taux_tva": "20.00",
    "unite": "unite",
    "actif": 1,
    "devise": "MGA",
    "quantite_stock": 80,
    "seuil_alerte": 3,
    "statut_stock": "disponible",
    "created_at": "2025-11-21T06:56:16.000Z",
    "updated_at": "2025-11-21T11:22:35.000Z"
  }
}
```
Commande cURL :

```bash
curl -X GET "http://localhost:3001/api/comptabilite/articles/ART001" \
  -H "Authorization: Bearer $TOKEN" | jq
```
#### ➕ 3. CRÉER UN NOUVEL ARTICLE
🔹 POST /
Accès : Comptable ou Admin
Description : Crée un nouvel article dans le catalogue

Body :
```bash

json
{
  "code_article": "ART100",
  "description": "Nouveau Produit Test",
  "prix_unitaire": 25000,
  "taux_tva": 20,
  "unite": "unite",
  "quantite_stock": 100,
  "seuil_alerte": 10,
  "actif": true
}

```
***Champs Obligatoires :***

code_article (string, unique)

description (string)

prix_unitaire (number)

Champs Optionnels :

taux_tva (number, default: 20)

unite (string, default: "unite")

quantite_stock (number, default: 0)

seuil_alerte (number, default: 5)

actif (boolean, default: true)

Response :
```bash
json
{
  "success": true,
  "message": {
    "code_article": "ART100",
    "description": "Nouveau Produit Test",
    "prix_unitaire": "25000.00",
    "taux_tva": "20.00",
    "unite": "unite",
    "actif": 1,
    "devise": "MGA",
    "quantite_stock": 100,
    "seuil_alerte": 10,
    "created_at": "2025-11-22T06:29:29.000Z",
    "updated_at": "2025-11-22T06:29:29.000Z"
  },
  "data": "Article créé avec succès"
}
```
Commande cURL :

```bash
curl -X POST "http://localhost:3001/api/comptabilite/articles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code_article": "ART100",
    "description": "Nouveau Produit Test",
    "prix_unitaire": 25000,
    "taux_tva": 20,
    "unite": "unite",
    "quantite_stock": 100,
    "seuil_alerte": 10,
    "actif": true
  }' | jq
  ```

#### ✏️ 4. MODIFIER UN ARTICLE
🔹 PUT /:code
Accès : Comptable ou Admin
Paramètre : code - Code de l'article à modifier

Body :
```bash
json
{
  "description": "Produit Modifié",
  "prix_unitaire": 30000,
  "taux_tva": 20,
  "unite": "unite",
  "quantite_stock": 150,
  "seuil_alerte": 15,
  "actif": true
}
```
Tous les champs sont optionnels - seuls les champs fournis seront mis à jour.

Response :
```bash
json
{
  "success": true,
  "message": {
    "code_article": "ART100",
    "description": "Produit Modifié",
    "prix_unitaire": "30000.00",
    "taux_tva": "20.00",
    "unite": "unite",
    "actif": 1,
    "devise": "MGA",
    "quantite_stock": 150,
    "seuil_alerte": 15,
    "created_at": "2025-11-22T06:29:29.000Z",
    "updated_at": "2025-11-22T06:31:58.000Z"
  },
  "data": "Article mis à jour avec succès"
}

```
Commande cURL :

```bash
curl -X PUT "http://localhost:3001/api/comptabilite/articles/ART100" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Produit Modifié",
    "prix_unitaire": 30000,
    "quantite_stock": 150,
    "seuil_alerte": 15,
    "actif": true
  }' | jq
  ```

#### 🗑️ 5. SUPPRIMER UN ARTICLE
🔹 DELETE /:code
Accès : Admin seulement
Paramètre : code - Code de l'article à supprimer

Response :
```bash
json
{
  "success": true,
  "data": null,
  "message": "Article supprimé avec succès"
}
```
Commande cURL :

```bash
curl -X DELETE "http://localhost:3001/api/comptabilite/articles/ART100" \
  -H "Authorization: Bearer $TOKEN" | jq
```
📊 ENDPOINTS SPÉCIFIQUES STOCK

#### 🔄 6. METTRE À JOUR LE STOCK COMPLET
🔹 PUT /:code/stock
Accès : Comptable ou Admin
Description : Définit la quantité de stock exacte

Body :
```bash
json
{
  "quantite_stock": 200,
  "seuil_alerte": 20
}
Response :

json
{
  "success": true,
  "message": {
    "code_article": "ART100",
    "quantite_stock": 200,
    "seuil_alerte": 20,
    "statut_stock": "disponible"
  },
  "data": "Stock mis à jour avec succès"
}
```
Commande cURL :

``` bash
curl -X PUT "http://localhost:3001/api/comptabilite/articles/ART100/stock" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantite_stock": 200,
    "seuil_alerte": 20
  }' | jq
  ```

#### 📈 7. AJUSTER LE STOCK (± quantité)
🔹 PATCH /:code/stock/adjust
Accès : Comptable ou Admin
Description : Ajoute ou retire une quantité du stock

Body :
```bash
json
{
  "quantite": -25,
  "raison": "Vente client XYZ"
}
```
Notes :

quantite positive : ajoute au stock

quantite négative : retire du stock

Response :
```bash
json
{
  "success": true,
  "message": {
    "code_article": "ART100",
    "quantite_stock": 175,
    "ancien_stock": 200,
    "variation": -25,
    "statut_stock": "disponible"
  },
  "data": "Stock ajusté avec succès"
}
```
Commande cURL :

```bash

curl -X PATCH "http://localhost:3001/api/comptabilite/articles/ART100/stock/adjust" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantite": -25,
    "raison": "Vente client XYZ"
  }' | 
  ```

#### 🚨 8. ALERTES DE STOCK
🔹 GET /alertes/stock
Accès : Comptable ou Admin
Description : Récupère les articles en rupture ou stock faible

Response :
```bash
json
{
  "success": true,
  "data": {
    "rupture_stock": [
      {
        "code_article": "ART002",
        "description": "Souris USB",
        "quantite_stock": 0,
        "seuil_alerte": 5,
        "statut_stock": "rupture"
      }
    ],
    "stock_faible": [
      {
        "code_article": "ART005",
        "description": "Formation Logiciel",
        "quantite_stock": 15,
        "seuil_alerte": 3,
        "statut_stock": "stock_faible"
      }
    ],
    "total_alertes": 2
  },
  "message": "Alertes stock récupérées avec succès"
}
```
Commande cURL :

```bash
curl -X GET "http://localhost:3001/api/comptabilite/articles/alertes/stock" \
  -H "Authorization: Bearer $TOKEN" | jq
```

#### ✅ 9. VÉRIFIER LA DISPONIBILITÉ
🔹 GET /:code/disponibilite?quantite=50
Accès : Public
Paramètre Query : quantite - Quantité demandée (défaut: 1)

Response :
```bash
json
{
  "success": true,
  "data": {
    "disponible": true,
    "quantite_stock": 80,
    "quantite_demandee": 50,
    "statut": "disponible",
    "message": "Stock suffisant (80 disponible(s))"
  },
  "message": "Disponibilité vérifiée avec succès"
}
```
Commande cURL :

```bash
curl -X GET "http://localhost:3001/api/comptabilite/articles/ART001/disponibilite?quantite=50" \
  -H "Authorization: Bearer $TOKEN" | jq
```

#### 🏷️ 10. ARTICLES PAR STATUT DE STOCK
🔹 GET /statut/:statut
Accès : Public
Paramètre : statut - disponible, stock_faible, ou rupture

Response :
```bash
json
{
  "success": true,
  "message": [
    {
      "code_article": "ART002",
      "description": "Souris USB",
      "quantite_stock": 0,
      "seuil_alerte": 5,
      "statut_stock": "rupture"
    }
  ],
  "data": "Articles avec statut rupture récupérés avec succès"
}
```
Commandes cURL :

```bash
# Articles en rupture
curl -X GET "http://localhost:3001/api/comptabilite/articles/statut/rupture" \
  -H "Authorization: Bearer $TOKEN" | jq

# Articles en stock faible
curl -X GET "http://localhost:3001/api/comptabilite/articles/statut/stock_faible" \
  -H "Authorization: Bearer $TOKEN" | jq

# Articles disponibles
curl -X GET "http://localhost:3001/api/comptabilite/articles/statut/disponible" \
  -H "Authorization: Bearer $TOKEN" | jq
  ```
#### ⚠️ CODES D'ERREUR
Code	Signification
400	Données invalides
401	Non authentifié
403	Permission refusée
404	Article non trouvé
409	Code article déjà existant
500	Erreur serveur
##### 💡 EXEMPLE D'UTILISATION COMPLET
Workflow typique :
Lister les articles → GET /

Vérifier disponibilité → GET /:code/disponibilite?quantite=X

Ajuster stock après vente → PATCH /:code/stock/adjust

Surveiller alertes → GET /alertes/stock

Script d'utilisation :
```bash
# 1. Obtenir token
TOKEN=$(curl -s -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aquatiko.mg","password":"password123"}' | jq -r '.data.token')

# 2. Lister articles
curl -s -X GET "http://localhost:3001/api/comptabilite/articles" \
  -H "Authorization: Bearer $TOKEN" | jq '.message[] | {code: .code_article, description: .description, stock: .quantite_stock}'
```