import { db } from '../../../core/database/connection.js';

export class ReferentielRepository {
  async getTypesFacture() {
    return db('referentiel_types_facture').where('actif', true);
  }

  async getModesPaiement() {
    return db('referentiel_modes_paiement').where('actif', true);
  }

  async getTauxTVA() {
    return db('referentiel_taux_tva').where('actif', true).orderBy('taux');
  }

  async addModePaiement(code, libelle) {
    await db('referentiel_modes_paiement').insert({ code, libelle });
  }

  async addTypeFacture(code, libelle) {
    await db('referentiel_types_facture').insert({ code, libelle });
  }

  async addTauxTVA(taux, libelle) {
    await db('referentiel_taux_tva').insert({ taux, libelle });
  }
}