// src/modules/import-export/index.js
import importExportRoutes from './routes/index.js';

// ✅ CORRECTION : Utiliser export default au lieu de module.exports
export default importExportRoutes;

// Ou si vous voulez garder la structure d'objet :
// export default {
//   routes: importExportRoutes
// };