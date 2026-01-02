import { ReferentielRepository } from '../repositories/ReferentielRepository.js';
import { PlanComptableRepository } from '../repositories/PlanComptableRepository.js';

export class ReferentielService {
  constructor() {
    this.referentielRepo = new ReferentielRepository();
    this.planComptableRepo = new PlanComptableRepository();
  }

  async getModesPaiement() {
    return this.referentielRepo.getModesPaiement();
  }

  async getTypesFacture() {
    return this.referentielRepo.getTypesFacture();
  }

  async getTauxTVA() {
    return this.referentielRepo.getTauxTVA();
  }

  async getPlanComptable() {
    return this.planComptableRepo.findAll();
  }

  async addModePaiement(code, libelle) {
    return this.referentielRepo.addModePaiement(code, libelle);
  }

  async addTypeFacture(code, libelle) {
    return this.referentielRepo.addTypeFacture(code, libelle);
  }

  async addTauxTVA(taux, libelle) {
    return this.referentielRepo.addTauxTVA(taux, libelle);
  }

  async addCompteComptable(data) {
    return this.planComptableRepo.create(data);
  }
}