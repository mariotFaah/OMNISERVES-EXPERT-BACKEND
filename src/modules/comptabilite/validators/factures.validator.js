import Joi from 'joi';

export const ligneFactureSchema = Joi.object({
  code_article: Joi.string().max(50).optional().messages({
    'string.max': 'Le code article ne peut pas dépasser 50 caractères'
  }),
  description: Joi.string().max(255).optional().messages({
    'string.max': 'La description ne peut pas dépasser 255 caractères'
  }),
  quantite: Joi.number().min(0.01).precision(2).required().messages({
    'number.base': 'La quantité doit être un nombre',
    'number.min': 'La quantité doit être supérieure à 0',
    'any.required': 'La quantité est obligatoire'
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
  remise: Joi.number().min(0).max(100).precision(2).default(0).messages({
    'number.base': 'La remise doit être un nombre',
    'number.min': 'La remise ne peut pas être négative',
    'number.max': 'La remise ne peut pas dépasser 100%'
  })
});

export const createFactureSchema = Joi.object({
  date: Joi.date().iso().max('now').required().messages({
    'date.base': 'La date doit être une date valide',
    'date.format': 'La date doit être au format ISO (YYYY-MM-DD)',
    'date.max': 'La date ne peut pas être dans le futur',
    'any.required': 'La date est obligatoire'
  }),
  type_facture: Joi.string().valid('proforma', 'facture', 'avoir').required().messages({
    'any.only': 'Le type de facture doit être "proforma", "facture" ou "avoir"',
    'any.required': 'Le type de facture est obligatoire'
  }),
  id_tiers: Joi.number().integer().min(1).required().messages({
    'number.base': 'L\'ID du tiers doit être un nombre',
    'number.min': 'L\'ID du tiers doit être positif',
    'any.required': 'L\'ID du tiers est obligatoire'
  }),
  echeance: Joi.date().iso().min(Joi.ref('date')).required().messages({
    'date.base': 'L\'échéance doit être une date valide',
    'date.format': 'L\'échéance doit être au format ISO (YYYY-MM-DD)',
    'date.min': 'L\'échéance ne peut pas être antérieure à la date de facture',
    'any.required': 'L\'échéance est obligatoire'
  }),
  reglement: Joi.string().max(50).optional().messages({
    'string.max': 'Le mode de règlement ne peut pas dépasser 50 caractères'
  }),
  lignes: Joi.array().items(ligneFactureSchema).min(1).required().messages({
    'array.min': 'La facture doit contenir au moins une ligne',
    'any.required': 'Les lignes de facture sont obligatoires'
  })
});

export const updateFactureSchema = Joi.object({
  date: Joi.date().iso().max('now').optional(),
  echeance: Joi.date().iso().min(Joi.ref('date')).optional(),
  reglement: Joi.string().max(50).optional()
});
