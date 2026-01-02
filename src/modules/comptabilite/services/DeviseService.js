// src/modules/comptabilite/services/DeviseService.js
import { TauxChangeRepository } from '../repositories/TauxChangeRepository.js';

export class DeviseService { 
  constructor() {
    this.tauxChangeRepo = new TauxChangeRepository();
  }

  async convertirMontant(montant, devise_source, devise_cible, date = new Date()) {
    if (devise_source === devise_cible) {
      return montant;
    }

    const taux = await this.tauxChangeRepo.getTauxByDate(devise_source, devise_cible, date);
    
    if (!taux) {
      throw new Error(`Taux de change non trouvé pour ${devise_source}->${devise_cible} à la date ${date}`);
    }

    return montant * taux.taux;
  }

  async mettreAJourTaux(devise_source, devise_cible, nouveau_taux, date_effet = new Date()) {
    // Désactiver les anciens taux
    await this.tauxChangeRepo.desactiverAnciensTaux(devise_source, devise_cible);

    // Créer le nouveau taux
    return this.tauxChangeRepo.create({
      devise_source,
      devise_cible,
      taux: nouveau_taux,
      date_effet,
      actif: true
    });
  }

  get tauxChangeRepository() {
    return this.tauxChangeRepo;
  }
}

export default DeviseService;