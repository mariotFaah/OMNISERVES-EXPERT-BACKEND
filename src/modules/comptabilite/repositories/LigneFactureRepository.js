import { db } from '../../../core/database/connection.js';

export class LigneFactureRepository {
  
  // Récupérer toutes les lignes d'une facture
  async findByFacture(numero_facture) {
    try {
      const lignes = await db('ligne_facture as lf')
        .leftJoin('articles as a', 'lf.code_article', 'a.code_article')
        .select(
          'lf.*',
          'a.description as article_description',
          'a.unite as article_unite'
        )
        .where('lf.numero_facture', numero_facture)
        .orderBy('lf.id_ligne', 'asc');
      
      return lignes;
    } catch (error) {
      console.error('Erreur LigneFactureRepository.findByFacture:', error);
      throw new Error('Erreur lors de la récupération des lignes de facture');
    }
  }

  // Ajouter une ligne à une facture
  async create(ligneData) {
    try {
      const [id_ligne] = await db('ligne_facture').insert(ligneData);
      
      const nouvelleLigne = await db('ligne_facture as lf')
        .leftJoin('articles as a', 'lf.code_article', 'a.code_article')
        .select(
          'lf.*',
          'a.description as article_description',
          'a.unite as article_unite'
        )
        .where('lf.id_ligne', id_ligne)
        .first();
      
      return nouvelleLigne;
    } catch (error) {
      console.error('Erreur LigneFactureRepository.create:', error);
      throw new Error('Erreur lors de la création de la ligne de facture');
    }
  }

  // Supprimer une ligne de facture
  async delete(id_ligne) {
    try {
      await db('ligne_facture')
        .where('id_ligne', id_ligne)
        .delete();
      
      return { message: 'Ligne de facture supprimée avec succès' };
    } catch (error) {
      console.error('Erreur LigneFactureRepository.delete:', error);
      throw new Error('Erreur lors de la suppression de la ligne de facture');
    }
  }

  // Calculer les totaux d'une facture
  async calculerTotals(numero_facture) {
    try {
      const result = await db('ligne_facture')
        .where('numero_facture', numero_facture)
        .select(
          db.raw('SUM(montant_ht) as total_ht'),
          db.raw('SUM(montant_tva) as total_tva'),
          db.raw('SUM(montant_ttc) as total_ttc')
        )
        .first();
      
      return {
        total_ht: parseFloat(result.total_ht) || 0,
        total_tva: parseFloat(result.total_tva) || 0,
        total_ttc: parseFloat(result.total_ttc) || 0
      };
    } catch (error) {
      console.error('Erreur LigneFactureRepository.calculerTotals:', error);
      throw new Error('Erreur lors du calcul des totaux de la facture');
    }
  }

async deleteByFacture(numero_facture) {
  try {
    
    const result = await db('ligne_facture')
      .where('numero_facture', numero_facture)
      .delete();
    
    return result;
    
  } catch (error) {
    console.error('❌ Erreur LigneFactureRepository.deleteByFacture:', error);
    throw new Error('Erreur lors de la suppression des lignes de facture');
  }
}
}

export default LigneFactureRepository;