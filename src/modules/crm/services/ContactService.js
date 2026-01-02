import { ContactRepository } from '../repositories/ContactRepository.js';

export class ContactService {
  constructor() {
    this.contactRepository = new ContactRepository();
  }

  async getContactsByClient(tiers_id) {
    try {
      return await this.contactRepository.findByClient(tiers_id);
    } catch (error) {
      console.error('Erreur ContactService.getContactsByClient:', error);
      throw new Error('Erreur lors de la récupération des contacts');
    }
  }

  async getContactById(id_contact) {
    try {
      const contact = await this.contactRepository.findById(id_contact);
      
      if (!contact) {
        throw new Error('Contact non trouvé');
      }

      return contact;
    } catch (error) {
      console.error('Erreur ContactService.getContactById:', error);
      throw new Error(`Erreur lors de la récupération du contact: ${error.message}`);
    }
  }

  async createContact(contactData) {
    try {
      // Validation des données requises
      if (!contactData.tiers_id || !contactData.nom) {
        throw new Error('Le client et le nom sont obligatoires');
      }

      return await this.contactRepository.create(contactData);
    } catch (error) {
      console.error('Erreur ContactService.createContact:', error);
      throw new Error(`Erreur lors de la création du contact: ${error.message}`);
    }
  }

  async updateContact(id_contact, contactData) {
    try {
      // Vérifier que le contact existe
      const existingContact = await this.contactRepository.findById(id_contact);
      if (!existingContact) {
        throw new Error('Contact non trouvé');
      }

      return await this.contactRepository.update(id_contact, contactData);
    } catch (error) {
      console.error('Erreur ContactService.updateContact:', error);
      throw new Error(`Erreur lors de la mise à jour du contact: ${error.message}`);
    }
  }

  async deleteContact(id_contact) {
    try {
      const contact = await this.contactRepository.findById(id_contact);
      
      if (!contact) {
        throw new Error('Contact non trouvé');
      }

      return await this.contactRepository.delete(id_contact);
    } catch (error) {
      console.error('Erreur ContactService.deleteContact:', error);
      throw new Error(`Erreur lors de la suppression du contact: ${error.message}`);
    }
  }
}

export default ContactService;
