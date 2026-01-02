// src/modules/comptabilite/validators/articles.validator.js
import Joi from 'joi';

export const createArticleSchema = Joi.object({
  code_article: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Le code article est obligatoire',
    'string.min': 'Le code article doit contenir au moins 2 caractères',
    'string.max': 'Le code article ne peut pas dépasser 50 caractères'
  }),
  description: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'La description est obligatoire',
    'string.min': 'La description doit contenir au moins 2 caractères',
    'string.max': 'La description ne peut pas dépasser 255 caractères'
  }),
  prix_unitaire: Joi.number().min(0).precision(2).required().messages({
    'number.base': 'Le prix unitaire doit être un nombre',
    'number.min': 'Le prix unitaire ne peut pas être négatif',
    'any.required': 'Le prix unitaire est obligatoire'
  }),
  taux_tva: Joi.number().min(0).max(100).precision(2).default(20).messages({
    'number.base': 'Le taux TVA doit être un nombre',
    'number.min': 'Le taux TVA ne peut pas être négatif',
    'number.max': 'Le taux TVA ne peut pas dépasser 100%'
  }),
  unite: Joi.string().max(20).default('unite').messages({
    'string.max': 'L\'unité ne peut pas dépasser 20 caractères'
  }),
  // NOUVEAUX CHAMPS STOCK
  quantite_stock: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'La quantité en stock doit être un nombre entier',
    'number.min': 'La quantité en stock ne peut pas être négative',
    'number.integer': 'La quantité en stock doit être un nombre entier'
  }),
  seuil_alerte: Joi.number().integer().min(0).default(5).messages({
    'number.base': 'Le seuil d\'alerte doit être un nombre entier',
    'number.min': 'Le seuil d\'alerte ne peut pas être négatif',
    'number.integer': 'Le seuil d\'alerte doit être un nombre entier'
  }),
  devise: Joi.string().max(10).default('MGA').messages({
    'string.max': 'La devise ne peut pas dépasser 10 caractères'
  }),
  actif: Joi.boolean().default(true)
});

export const updateArticleSchema = Joi.object({
  description: Joi.string().min(2).max(255).optional(),
  prix_unitaire: Joi.number().min(0).precision(2).optional(),
  taux_tva: Joi.number().min(0).max(100).precision(2).optional(),
  unite: Joi.string().max(20).optional(),
  // NOUVEAUX CHAMPS STOCK POUR LA MISE À JOUR
  quantite_stock: Joi.number().integer().min(0).optional().messages({
    'number.base': 'La quantité en stock doit être un nombre entier',
    'number.min': 'La quantité en stock ne peut pas être négative',
    'number.integer': 'La quantité en stock doit être un nombre entier'
  }),
  seuil_alerte: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Le seuil d\'alerte doit être un nombre entier',
    'number.min': 'Le seuil d\'alerte ne peut pas être négatif',
    'number.integer': 'Le seuil d\'alerte doit être un nombre entier'
  }),
  devise: Joi.string().max(10).optional(),
  actif: Joi.boolean().optional()
});

// NOUVEAUX SCHEMAS POUR LA GESTION DU STOCK
export const updateStockSchema = Joi.object({
  quantite_stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'La quantité en stock doit être un nombre entier',
    'number.min': 'La quantité en stock ne peut pas être négative',
    'number.integer': 'La quantité en stock doit être un nombre entier',
    'any.required': 'La quantité en stock est obligatoire'
  })
});

export const adjustStockSchema = Joi.object({
  quantite: Joi.number().integer().required().messages({
    'number.base': 'La quantité doit être un nombre entier',
    'number.integer': 'La quantité doit être un nombre entier',
    'any.required': 'La quantité est obligatoire'
  })
});