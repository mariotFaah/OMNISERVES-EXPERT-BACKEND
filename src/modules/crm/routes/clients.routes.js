import { Router } from 'express';
import { ClientController } from '../controllers/ClientController.js';
// ✅ AJOUT :
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = Router();
const clientController = new ClientController();

// Routes pour les clients CRM - PROTÉGÉES (commercial et admin)
router.get('/', 
  auth,
  requireRole('commercial'),
  clientController.getAllClients
);

router.get('/categorie/:categorie', 
  auth,
  requireRole('commercial'),
  clientController.getClientsByCategorie
);

router.get('/:id', 
  auth,
  requireRole('commercial'),
  clientController.getClientDetails
);

router.put('/:id/crm', 
  auth,
  requireRole('commercial'),
  clientController.updateClientCRM
);

router.get('/:id/activites', 
  auth,
  requireRole('commercial'),
  clientController.getClientActivites
);

router.get('/:id/activites-consolidees', 
  auth,
  requireRole('commercial'),
  clientController.getClientActivitesConsolidees
);

router.get('/:id/devis', 
  auth,
  requireRole('commercial'),
  clientController.getClientDevis
);

router.get('/:id/contrats', 
  auth,
  requireRole('commercial'),
  clientController.getClientContrats
);

export default router;
