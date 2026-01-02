// src/modules/comptabilite/validators/devises.validator.js
export const convertirValidator = {
  montant: {
    in: ['body'],
    isFloat: { min: 0 },
    errorMessage: 'Le montant doit être un nombre positif'
  },
  devise_source: {
    in: ['body'],
    notEmpty: true,
    isLength: { min: 3, max: 3 },
    errorMessage: 'La devise source doit avoir 3 caractères'
  },
  devise_cible: {
    in: ['body'],
    notEmpty: true,
    isLength: { min: 3, max: 3 },
    errorMessage: 'La devise cible doit avoir 3 caractères'
  }
};