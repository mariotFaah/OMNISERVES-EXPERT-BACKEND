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

// Vérifier les variables d'environnement critiques (en production sur Vercel)
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
if (process.env.NODE_ENV === 'production') {
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingEnvVars.length > 0) {
    console.error('❌ Variables d\'environnement manquantes:', missingEnvVars);
    // En production, on continue mais on log l'erreur
    console.error('⚠️  La connexion à la base de données risque d\'échouer');
  }
}

const app = express();

// Middleware CORS - configuration pour Vercel
const allowedOrigins = [
  'https://omniserves-experts-frontend.vercel.app',
  'https://omniserves-experts-frontend.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
];

app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (curl, postman, server-side)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('CORS bloqué pour:', origin);
      // En production, on peut être plus strict
      if (process.env.NODE_ENV === 'production') {
        callback(new Error('Not allowed by CORS'));
      } else {
        callback(null, true); // En dev, on autorise tout
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json({ limit: '10mb' }));

// Middleware de logging (uniquement en dev pour éviter trop de logs sur Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

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
      service: 'OMNISERVES EXPERT API',
      version: '1.0.0',
      modules: ['comptabilite', 'import-export', 'crm', 'auth']  
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Erreur lors de la vérification de la santé',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ Modules initialisés avec succès');
  }
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation des modules:', error);
  // En production, on continue mais on log l'erreur
  if (process.env.NODE_ENV === 'production') {
    console.error('Détails de l\'erreur:', error.message);
  }
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

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'OMNISERVES EXPERT API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      auth: '/api/auth/login',
      comptabilite: '/api/comptabilite/factures',
      crm: '/api/crm/tiers',
      importExport: '/api/import-export/commandes'
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Gestion des routes non trouvées
app.use('/:any*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method,
    available_endpoints: ['/', '/api/health', '/api/auth/login', '/api/comptabilite/factures']
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack:', err.stack);
  }
  
  res.status(500).json({
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
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3001;
  
  app.listen(PORT, async () => {
    console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
    console.log(`📊 URL: http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔧 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Base de données: TiDB Cloud`);
    console.log(`📁 Database: ${process.env.DB_NAME || 'Not configured'}`);
    
    // Tester la connexion
    console.log('\n🔌 Test de connexion TiDB...');
    await testConnection();
  });
}

// Export pour Vercel (CRITIQUE)
export default app;