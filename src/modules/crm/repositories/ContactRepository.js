import { db } from '../../../core/database/connection.js';
import { Contact } from '../entities/Contact.js';

export class ContactRepository {
  
  async findByClient(tiers_id) {
    try {
      const contacts = await db('contacts')
        .where('tiers_id', tiers_id)
        .orderBy('principal', 'desc')
        .orderBy('nom', 'asc');
      
      return contacts.map(contact => new Contact(contact));
    } catch (error) {
      console.error('Erreur ContactRepository.findByClient:', error);
      throw new Error('Erreur lors de la récupération des contacts');
    }
  }

  async findById(id_contact) {
    try {
      const contact = await db('contacts')
        .where('id_contact', id_contact)
        .first();
      
      return contact ? new Contact(contact) : null;
    } catch (error) {
      console.error('Erreur ContactRepository.findById:', error);
      throw new Error('Erreur lors de la récupération du contact');
    }
  }

  async create(contactData) {
    try {
      // Si c'est le contact principal, désactiver les autres contacts principaux
      if (contactData.principal) {
        await db('contacts')
          .where('tiers_id', contactData.tiers_id)
          .where('principal', true)
          .update({ principal: false });
      }

      const [id_contact] = await db('contacts').insert(contactData);
      
      return await this.findById(id_contact);
    } catch (error) {
      console.error('Erreur ContactRepository.create:', error);
      throw new Error('Erreur lors de la création du contact');
    }
  }

  async update(id_contact, contactData) {
    try {
      // Si on définit ce contact comme principal
      if (contactData.principal) {
        await db('contacts')
          .where('tiers_id', contactData.tiers_id)
          .where('principal', true)
          .update({ principal: false });
      }

      await db('contacts')
        .where('id_contact', id_contact)
        .update({
          ...contactData,
          updated_at: new Date()
        });
      
      return await this.findById(id_contact);
    } catch (error) {
      console.error('Erreur ContactRepository.update:', error);
      throw new Error('Erreur lors de la mise à jour du contact');
    }
  }

  async delete(id_contact) {
    try {
      await db('contacts')
        .where('id_contact', id_contact)
        .delete();
      
      return { message: 'Contact supprimé avec succès' };
    } catch (error) {
      console.error('Erreur ContactRepository.delete:', error);
      throw new Error('Erreur lors de la suppression du contact');
    }
  }

  
}

export default ContactRepository;
