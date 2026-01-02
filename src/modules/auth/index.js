// backend/src/modules/auth/index.js
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js'; // AJOUTER CETTE LIGNE

export const initAuthModule = (app) => {
  // Routes d'authentification
  app.use('/api/auth', authRoutes);
  
  // AJOUTER : Routes de gestion des utilisateurs
  app.use('/api/auth/users', userRoutes);
  
  console.log('✅ Module d\'authentification initialisé');
  console.log('📋 Routes disponibles:');
  console.log('   - POST /api/auth/login');
  console.log('   - POST /api/auth/logout'); 
  console.log('   - GET  /api/auth/verify');
  console.log('   - GET  /api/auth/users (admin)');
  console.log('   - POST /api/auth/users (admin)');
  console.log('   - PUT  /api/auth/users/:id (admin)');
};