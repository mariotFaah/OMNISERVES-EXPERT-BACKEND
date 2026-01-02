// src/core/middleware/validation.js
import Joi from 'joi';

// Middleware de validation générique
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Données de requête invalides',
        errors: errors
      });
    }

    next();
  };
};

// Alias pour compatibilité (utilisé dans tiers.routes.js)
export const validateRequest = validate;

// Validation d'ID numérique
export const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: 'ID invalide'
    });
  }
  
  next();
};

// Validation de pagination
export const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: 'Paramètres de pagination invalides'
    });
  }
  
  next();
};

// Export par défaut pour compatibilité
export default {
  validate,
  validateRequest, // ✅ Ajout de l'alias
  validateId,
  validatePagination
};