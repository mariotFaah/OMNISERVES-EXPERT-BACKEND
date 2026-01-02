import Joi from 'joi';

export const createTiersSchema = Joi.object({
  nom: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'Le nom est obligatoire',
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut pas dépasser 255 caractères'
  }),
  type_tiers: Joi.string().valid('client', 'fournisseur').required().messages({
    'any.only': 'Le type de tiers doit être "client" ou "fournisseur"',
    'any.required': 'Le type de tiers est obligatoire'
  }),
  numero: Joi.string().max(50).allow('').optional().messages({
    'string.max': 'Le numéro ne peut pas dépasser 50 caractères'
  }),
  adresse: Joi.string().max(500).allow('').optional().messages({
    'string.max': 'L\'adresse ne peut pas dépasser 500 caractères'
  }),
  email: Joi.string()
    .email({ 
      tlds: { 
        allow: false 
      } 
    })
    .allow('')
    .optional()
    .messages({
      'string.email': 'L\'email doit être une adresse email valide'
    }),
  telephone: Joi.string().max(20).allow('').optional().messages({
    'string.max': 'Le téléphone ne peut pas dépasser 20 caractères'
  })
});

export const updateTiersSchema = Joi.object({
  nom: Joi.string().min(2).max(255).optional(),
  type_tiers: Joi.string().valid('client', 'fournisseur').optional(),
  numero: Joi.string().max(50).allow('').optional(),
  adresse: Joi.string().max(500).allow('').optional(),
  email: Joi.string()
    .email({ 
      tlds: { 
        allow: false 
      } 
    })
    .allow('')
    .optional(),
  telephone: Joi.string().max(20).allow('').optional()
}).min(1);