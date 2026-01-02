// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'fs';

// Database
import { testConnection } from './core/database/connection.js';

// Routes des modules
import comptabiliteRoutes from './modules/comptabilite/routes/index.js';
import importExportRoutes from './modules/import-export/routes/index.js';
import initCRMModule from './modules/crm/index.js'; 
import { initAuthModule } from './modules/auth/index.js';

import { auth } from './core/middleware/auth.js';

dotenv.config();

// Vérifier les variables d'environnement critiques
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Variables d\'environnement manquantes:', missingEnvVars);
  console.error('💡 Assurez-vous que le fichier .env est correctement configuré');
  process.exit(1);
}

// Vérifier le certificat SSL
if (process.env.DB_SSL_CA) {
  try {
    if (fs.existsSync(process.env.DB_SSL_CA)) {
      console.log(`✅ Certificat SSL trouvé: ${process.env.DB_SSL_CA}`);
    } else {
      console.warn(`⚠️ Certificat SSL non trouvé: ${process.env.DB_SSL_CA}`);
    }
  } catch (error) {
    console.warn('⚠️ Erreur lors de la vérification du certificat:', error.message);
  }
}

const app = express();

// Middleware CORS
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Route de santé
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await testConnection();
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'Connected' : 'Disconnected',
      database_type: 'TiDB Cloud',
      environment: process.env.NODE_ENV || 'development',
      modules: ['comptabilite', 'import-export', 'crm', 'auth']  
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Erreur lors de la vérification de la santé',
      error: error.message
    });
  }
});

// Initialiser les modules
try {
  initAuthModule(app);
  initCRMModule(app);
  
  // Routes protégées
  app.use('/api/comptabilite', auth, comptabiliteRoutes);
  app.use('/api/import-export', auth, importExportRoutes);
  
  console.log('✅ Modules initialisés avec succès');
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation des modules:', error);
}

// Route de test admin
app.get('/api/auth/users-test', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Accès réservé aux administrateurs' 
    });
  }
  
  res.json({
    success: true,
    message: 'Liste des utilisateurs (test)',
    data: [
      { 
        id: 15, 
        email: 'admin@aquatiko.mg', 
        nom: 'Admin', 
        prenom: 'Principal',
        role: 'admin',
        is_active: true,
        last_login: new Date().toISOString(),
        created_at: new Date().toISOString()
      },
      { 
        id: 16, 
        email: 'comptable@aquatiko.mg', 
        nom: 'Comptable', 
        prenom: 'Marie',
        role: 'comptable', 
        is_active: true,
        last_login: null,
        created_at: new Date().toISOString()
      }
    ]
  });
});

// Gestion des routes non trouvées
app.use('/:any*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  console.log(`📊 URL: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Base de données: TiDB Cloud`);
  console.log(`📁 Database: ${process.env.DB_NAME}`);
  
  // Tester la connexion
  console.log('\n🔌 Test de connexion TiDB...');
  await testConnection();
});