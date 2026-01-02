import { db } from '../../../core/database/connection.js';

export class EcritureComptableRepository {
  
  // Récupérer les écritures par journal et période
  async findByJournal(journal, date_debut, date_fin) {
    try {
      let query = db('ecritures_comptables')
        .where('journal', journal);
      
      if (date_debut) {
        query = query.andWhere('date', '>=', date_debut);
      }
      
      if (date_fin) {
        query = query.andWhere('date', '<=', date_fin);
      }
      
      const ecritures = await query
        .orderBy('date', 'asc')
        .orderBy('numero_ecriture', 'asc');
      
      return ecritures;
    } catch (error) {
      console.error('Erreur EcritureComptableRepository.findByJournal:', error);
      throw new Error('Erreur lors de la récupération des écritures');
    }
  }

  // Créer une nouvelle écriture
  async create(ecritureData) {
    try {
      const [id_ecriture] = await db('ecritures_comptables').insert(ecritureData);
      
      const nouvelleEcriture = await db('ecritures_comptables')
        .where('id_ecriture', id_ecriture)
        .first();
      
      return nouvelleEcriture;
    } catch (error) {
      console.error('Erreur EcritureComptableRepository.create:', error);
      throw new Error('Erreur lors de la création de l\'écriture comptable');
    }
  }

  // Récupérer le solde d'un compte
  async getSoldeCompte(compte, date_fin) {
    try {
      let query = db('ecritures_comptables')
        .where('compte', compte);
      
      if (date_fin) {
        query = query.andWhere('date', '<=', date_fin);
      }
      
      const result = await query
        .select(
          db.raw('COALESCE(SUM(debit), 0) as total_debit'),
          db.raw('COALESCE(SUM(credit), 0) as total_credit')
        )
        .first();
      
      return {
        debit: parseFloat(result.total_debit) || 0,
        credit: parseFloat(result.total_credit) || 0,
        solde: (parseFloat(result.total_debit) || 0) - (parseFloat(result.total_credit) || 0)
      };
    } catch (error) {
      console.error('Erreur EcritureComptableRepository.getSoldeCompte:', error);
      throw new Error('Erreur lors du calcul du solde du compte');
    }
  }

  // Récupérer le prochain numéro d'écriture
  async getNextNumeroEcriture() {
    try {
      const result = await db('ecritures_comptables')
        .max('numero_ecriture as max_numero')
        .first();
      
      const maxNumero = result.max_numero || '000000';
      const nextNum = parseInt(maxNumero.split('-').pop()) + 1;
      
      const aujourdhui = new Date();
      const prefix = `${aujourdhui.getFullYear()}${String(aujourdhui.getMonth() + 1).padStart(2, '0')}`;
      
      return `${prefix}-${String(nextNum).padStart(4, '0')}`;
    } catch (error) {
      console.error('Erreur EcritureComptableRepository.getNextNumeroEcriture:', error);
      throw new Error('Erreur lors de la génération du numéro d\'écriture');
    }
  }

  query() {
    return db('ecritures_comptables');
  }
}

export default EcritureComptableRepository;