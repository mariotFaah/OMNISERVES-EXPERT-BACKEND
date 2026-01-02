import { ContactService } from '../services/ContactService.js';
import { successResponse, errorResponse, createdResponse, notFoundResponse } from '../../../core/utils/response.js';

export class ContactController {
  constructor() {
    this.contactService = new ContactService();
  }

  // Récupérer les contacts d'un client
  getContactsByClient = async (req, res) => {
    try {
      const { clientId } = req.params;
      const contacts = await this.contactService.getContactsByClient(parseInt(clientId));
      successResponse(res, 'Contacts récupérés avec succès', contacts);
    } catch (error) {
      console.error('Erreur ContactController.getContactsByClient:', error);
      errorResponse(res, error.message, 500);
    }
  };

  // Récupérer un contact par ID
  getContactById = async (req, res) => {
    try {
      const { id } = req.params;
      const contact = await this.contactService.getContactById(parseInt(id));
      successResponse(res, 'Contact récupéré avec succès', contact);
    } catch (error) {
      console.error('Erreur ContactController.getContactById:', error);
      notFoundResponse(res, error.message);
    }
  };

  // Créer un nouveau contact
  createContact = async (req, res) => {
    try {
      const contactData = req.body;
      const nouveauContact = await this.contactService.createContact(contactData);
      createdResponse(res, 'Contact créé avec succès', nouveauContact);
    } catch (error) {
      console.error('Erreur ContactController.createContact:', error);
      errorResponse(res, error.message, 400);
    }
  };

  // Mettre à jour un contact
  updateContact = async (req, res) => {
    try {
      const { id } = req.params;
      const contactData = req.body;
      
      const contact = await this.contactService.updateContact(parseInt(id), contactData);
      successResponse(res, 'Contact mis à jour avec succès', contact);
    } catch (error) {
      console.error('Erreur ContactController.updateContact:', error);
      errorResponse(res, error.message, 400);
    }
  };

  // Supprimer un contact
  deleteContact = async (req, res) => {
    try {
      const { id } = req.params;
      await this.contactService.deleteContact(parseInt(id));
      successResponse(res, 'Contact supprimé avec succès', null);
    } catch (error) {
      console.error('Erreur ContactController.deleteContact:', error);
      errorResponse(res, error.message, 400);
    }
  };
}

export default ContactController;