import { Router } from 'express';
import { ContactController } from '../controllers/ContactController.js';
// ✅ AJOUT :
import { auth, requireRole } from '../../../core/middleware/auth.js';

const router = Router();
const contactController = new ContactController();

// Routes pour les contacts - PROTÉGÉES (commercial et admin)
router.get('/client/:clientId', 
  auth,
  requireRole('commercial'),
  contactController.getContactsByClient
);

router.get('/:id', 
  auth,
  requireRole('commercial'),
  contactController.getContactById
);

router.post('/', 
  auth,
  requireRole('commercial'),
  contactController.createContact
);

router.put('/:id', 
  auth,
  requireRole('commercial'),
  contactController.updateContact
);

router.delete('/:id', 
  auth,
  requireRole('commercial'),
  contactController.deleteContact
);

export default router;
