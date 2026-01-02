// src/modules/crm/routes/index.js
import { Router } from 'express';
import clientsRoutes from './clients.routes.js';
import devisRoutes from './devis.routes.js';
import contactsRoutes from './contacts.routes.js';
import relancesRoutes from './relances.routes.js';
import activitesRoutes from './activites.routes.js';
import contratsRoutes from './contrats.routes.js';

const router = Router();


// Montage des routes
router.use('/clients', clientsRoutes);
router.use('/devis', devisRoutes);
router.use('/contacts', contactsRoutes);
router.use('/relances', relancesRoutes);
router.use('/activites', activitesRoutes);
router.use('/contrats', contratsRoutes);



export default router;