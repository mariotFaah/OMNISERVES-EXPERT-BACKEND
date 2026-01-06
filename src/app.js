// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

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
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Variables d\'environnement manquantes:', missingEnvVars);
  console.error('⚠️  Configuration actuelle:');
  console.error('   DB_HOST:', process.env.DB_HOST || 'Non défini');
  console.error('   DB_USER:', process.env.DB_USER || 'Non défini');
  console.error('   DB_NAME:', process.env.DB_NAME || 'Non défini');
  
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ ERREUR CRITIQUE: Variables manquantes en production');
  }
}

const app = express();

// Middleware CORS - configuration pour Vercel
const allowedOrigins = [
  'https://omniservesexpert-frontend.vercel.app',
  'https://omniserves-experts-frontend.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:4173'
];

// Configuration de sécurité Helmet
app.use(helmet({
  contentSecurityPolicy: false, // Désactivé pour simplifier, peut être configuré plus tard
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (curl, postman, server-side)
    if (!origin) return callback(null, true);
    
    // En développement, autoriser tout
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('🚫 CORS bloqué pour:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  
  next();
});

// Route de santé améliorée
app.get('/api/health', async (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'OMNISERVES EXPERT API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    deploy_platform: process.env.VERCEL ? 'Vercel' : 'Local',
    db_config: {
      host: process.env.DB_HOST ? 'Configuré' : 'Manquant',
      user: process.env.DB_USER ? 'Configuré' : 'Manquant',
      database: process.env.DB_NAME ? 'Configuré' : 'Manquant',
      port: process.env.DB_PORT || 3306,
      ssl: process.env.DB_SSL || 'false'
    },
    modules: ['comptabilite', 'import-export', 'crm', 'auth']
  };

  try {
    // Tester la connexion seulement si toutes les variables sont présentes
    if (!missingEnvVars.length) {
      const dbStatus = await testConnection();
      healthCheck.database = dbStatus ? 'Connected ✅' : 'Disconnected ❌';
    } else {
      healthCheck.database = 'Not tested (missing config)';
      healthCheck.missing_vars = missingEnvVars;
    }
    
    res.json(healthCheck);
  } catch (error) {
    console.error('❌ Erreur health check:', error.message);
    healthCheck.status = 'ERROR';
    healthCheck.database = 'Error: ' + error.message;
    healthCheck.error = process.env.NODE_ENV === 'development' ? error.message : undefined;
    
    res.status(500).json(healthCheck);
  }
});

// Route de debug pour vérifier la config DB
app.get('/api/debug/db-config', (req, res) => {
  // Ne jamais envoyer le mot de passe réel
  const safeConfig = {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT || 3306,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_SSL: process.env.DB_SSL || 'false',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL || 'false',
    // Cacher le mot de passe
    DB_PASSWORD: process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-3) : 'Non défini'
  };
  
  res.json({
    success: true,
    message: 'Configuration de la base de données',
    config: safeConfig,
    missing_vars: missingEnvVars
  });
});

// Initialiser les modules
try {
  console.log('🔄 Initialisation des modules...');
  
  // Module d'authentification (routes publiques)
  initAuthModule(app);
  console.log('✅ Module Auth initialisé');
  
  // Module CRM
  initCRMModule(app);
  console.log('✅ Module CRM initialisé');
  
  // Routes protégées par authentification
  app.use('/api/comptabilite', auth, comptabiliteRoutes);
  app.use('/api/import-export', auth, importExportRoutes);
  
  console.log('✅ Modules protégés initialisés');
  
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation des modules:', error);
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack:', error.stack);
  }
}

// Route de test admin (protégée)
app.get('/api/auth/users-test', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Accès réservé aux administrateurs',
      user_role: req.user.role
    });
  }
  
  res.json({
    success: true,
    message: 'Liste des utilisateurs (test)',
    user: req.user, // Pour debug
    data: [
      { 
        id: 1, 
        email: 'admin@aquatiko.mg', 
        nom: 'Admin', 
        prenom: 'Principal',
        role: 'admin',
        is_active: true,
        last_login: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
    ]
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'OMNISERVES EXPERT API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      public: {
        health: '/api/health',
        auth: '/api/auth/login',
        debug: '/api/debug/db-config'
      },
      protected: {
        comptabilite: '/api/comptabilite/factures',
        crm: '/api/crm/tiers',
        importExport: '/api/import-export/commandes'
      }
    },
    environment: process.env.NODE_ENV || 'development',
    database: 'AlwaysData MySQL'
  });
});

// Gestion des routes non trouvées
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'Route API non trouvée',
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      available_endpoints: {
        root: '/',
        health: '/api/health',
        auth_login: '/api/auth/login',
        debug: '/api/debug/db-config'
      }
    });
  }
  next();
});

// Route fallback pour Vercel
app.get('/:any*', (req, res) => {
  res.redirect('/');
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });
  
  const statusCode = err.status || err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    })
  });
});

// Démarrage du serveur UNIQUEMENT en développement local
// Sur Vercel, c'est api/index.js qui sera exécuté
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  
  app.listen(PORT, async () => {
    console.log('\n🚀 ==========================================');
    console.log('   OMNISERVES EXPERT API - Backend');
    console.log('   ==========================================');
    console.log(`   Port: ${PORT}`);
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`   Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Base de données: AlwaysData MySQL`);
    
    if (missingEnvVars.length > 0) {
      console.log(`   ❌ Variables manquantes: ${missingEnvVars.join(', ')}`);
    } else {
      console.log(`   ✅ Configuration DB: OK`);
      console.log(`   📁 Database: ${process.env.DB_NAME}`);
    }
    
    console.log('   ==========================================\n');
    
    // Tester la connexion
    if (!missingEnvVars.length) {
      console.log('🔌 Test de connexion à la base de données...');
      try {
        await testConnection();
        console.log('✅ Connexion réussie!\n');
      } catch (error) {
        console.error('❌ Échec de connexion:', error.message);
        console.error('   Vérifiez vos variables d\'environnement');
        console.error('   Fichier .env:', process.env.DB_HOST, process.env.DB_USER, process.env.DB_NAME);
      }
    }
  });
}

// Export pour Vercel (CRITIQUE)
export default app;