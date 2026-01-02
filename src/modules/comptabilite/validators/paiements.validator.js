import { ReferentielService } from '../services/ReferentielService.js';

const referentielService = new ReferentielService();

export const createPaiementValidator = {
  numero_facture: {
    in: ['body'],
    isInt: { min: 1 },
    errorMessage: 'Le numéro de facture doit être un entier positif'
  },
  montant: {
    in: ['body'],
    isFloat: { min: 0.01 },
    errorMessage: 'Le montant doit être un nombre positif'
  },
  mode_paiement: {
    in: ['body'],
    custom: {
      options: async (value) => {
        const modes = await referentielService.getModesPaiement();
        const codes = modes.map(m => m.code);
        return codes.includes(value);
      },
      errorMessage: 'Mode de paiement invalide'
    }
  },
  date_paiement: {
    in: ['body'],
    isDate: true,
    errorMessage: 'Date de paiement invalide',
    optional: true
  }
};