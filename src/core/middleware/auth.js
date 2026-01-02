import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role === 'admin') return next();
    if (req.user.role === role) return next();
    res.status(403).json({ error: 'Accès refusé pour votre rôle' });
  };
};

// Middleware pour modules spécifiques
export const requireComptabilite = () => requireRole('comptable');
export const requireCommercial = () => requireRole('commercial');