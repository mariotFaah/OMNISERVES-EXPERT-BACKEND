// src/modules/auth/validators/auth.validator.js
import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email invalide',
    'any.required': 'L\'email est obligatoire'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
    'any.required': 'Le mot de passe est obligatoire'
  })
});

// Si vous avez d'autres schémas, ajoutez-les ici
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  nom: Joi.string().required(),
  role: Joi.string().valid('admin', 'comptable', 'commercial').default('commercial')
});

// Export par défaut pour la compatibilité
export default {
  loginSchema,
  registerSchema
};