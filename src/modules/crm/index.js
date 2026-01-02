// src/modules/crm/index.js
import crmRoutes from './routes/index.js';
import { auth, requireRole } from '../../core/middleware/auth.js';

export default function initCRMModule(app) {
  // ✅ ROUTE HEALTH PUBLIQUE
  app.get('/api/crm/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Module CRM opérationnel',
      timestamp: new Date().toISOString()
    });
  });

  // ✅ TOUTES LES AUTRES ROUTES CRM PROTÉGÉES
  app.use('/api/crm', auth, (req, res, next) => {
    // Vérifier les rôles autorisés (admin et commercial)
    if (req.user.role === 'admin' || req.user.role === 'commercial') {
      return next();
    }
    return res.status(403).json({ error: 'Accès refusé pour votre rôle' });
  }, crmRoutes);
  
  console.log('✅ Module CRM initialisé avec succès');
}