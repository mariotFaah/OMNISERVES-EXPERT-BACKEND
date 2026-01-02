// src/modules/comptabilite/index.js
import comptabiliteRoutes from './routes/index.js';

export { default as comptabiliteRoutes } from './routes/index.js';

// Export des services pour les autres modules
export { FacturationService } from './services/FacturationService.js';
export { CalculService } from './services/CalculService.js';
export { DeviseService } from './services/DeviseService.js';
export { PaiementService } from './services/PaiementService.js';
export { JournalService } from './services/JournalService.js';
export { RapportService } from './services/RapportService.js';

// Export des repositories si nécessaire
export { TiersRepository } from './repositories/TiersRepository.js';
export { ArticleRepository } from './repositories/ArticleRepository.js';
export { FactureRepository } from './repositories/FactureRepository.js';
export { LigneFactureRepository } from './repositories/LigneFactureRepository.js';
export { PaiementRepository } from './repositories/PaiementRepository.js';
export { TauxChangeRepository } from './repositories/TauxChangeRepository.js';
export { EcritureComptableRepository } from './repositories/EcritureComptableRepository.js';

// Export des entités
export { Tiers } from './entities/Tiers.js';
export { Article } from './entities/Article.js';
export { Facture } from './entities/Facture.js';
export { LigneFacture } from './entities/LigneFacture.js';
export { Paiement } from './entities/Paiement.js';
export { TauxChange } from './entities/TauxChange.js';
export { EcritureComptable } from './entities/EcritureComptable.js';

export default {
  routes: comptabiliteRoutes,
  name: 'comptabilite',
  version: '2.0.0',
  description: 'Module de comptabilité avec multi-devises, suivi des paiements et états financiers'
};