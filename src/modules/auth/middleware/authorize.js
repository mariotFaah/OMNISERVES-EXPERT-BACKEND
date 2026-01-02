// backend/src/modules/auth/middleware/authorize.js
export const authorize = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
    }

    // ✅ CORRECTION TEMPORAIRE : Vérifier l'email pour déterminer le rôle
    let userRole = req.user.role;
    
    if (!userRole) {
      // Déterminer le rôle basé sur l'email
      if (req.user.email.includes('admin@aquatiko.mg')) {
        userRole = 'admin';
      } else if (req.user.email.includes('comptable@aquatiko.mg')) {
        userRole = 'comptable';
      } else if (req.user.email.includes('commercial@aquatiko.mg')) {
        userRole = 'commercial';
      } else {
        userRole = 'commercial'; // Par défaut
      }
      
      console.log(`🔧 Rôle déterminé par email: ${userRole}`);
      req.user.role = userRole; // Mettre à jour pour les prochains middlewares
    }

    // L'admin a accès à tout
    if (userRole === 'admin') {
      return next();
    }

    // Vérifier le rôle requis
    if (userRole !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    next();
  };
};