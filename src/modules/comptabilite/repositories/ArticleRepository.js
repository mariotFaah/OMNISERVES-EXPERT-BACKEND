import { db } from '../../../core/database/connection.js';

export class ArticleRepository {
  
  async findAll() {
    try {
      const articles = await db('articles')
        .select('*')
        .orderBy('code_article', 'asc');
      
      return articles;
    } catch (error) {
      console.error('Erreur ArticleRepository.findAll:', error);
      throw new Error('Erreur lors de la récupération des articles');
    }
  }

  async findByCode(code_article) {
    try {
      const article = await db('articles')
        .where('code_article', code_article)
        .first();
      
      return article;
    } catch (error) {
      console.error('Erreur ArticleRepository.findByCode:', error);
      throw new Error('Erreur lors de la récupération de l\'article');
    }
  }

  async create(articleData) {
    try {
      await db('articles').insert(articleData);
      
      const nouvelArticle = await this.findByCode(articleData.code_article);
      return nouvelArticle;
    } catch (error) {
      console.error('Erreur ArticleRepository.create:', error);
      throw new Error('Erreur lors de la création de l\'article');
    }
  }

  async update(code_article, articleData) {
    try {
      await db('articles')
        .where('code_article', code_article)
        .update({
          ...articleData,
          updated_at: new Date()
        });
      
      const articleMaj = await this.findByCode(code_article);
      return articleMaj;
    } catch (error) {
      console.error('Erreur ArticleRepository.update:', error);
      throw new Error('Erreur lors de la mise à jour de l\'article');
    }
  }

  async delete(code_article) {
    try {
      await db('articles')
        .where('code_article', code_article)
        .delete();
      
      return { message: 'Article supprimé avec succès' };
    } catch (error) {
      console.error('Erreur ArticleRepository.delete:', error);
      throw new Error('Erreur lors de la suppression de l\'article');
    }
  }

  // Vérifier si un code article existe déjà
  async codeExists(code_article) {
    try {
      const exists = await db('articles')
        .where('code_article', code_article)
        .first();
      
      return !!exists;
    } catch (error) {
      console.error('Erreur ArticleRepository.codeExists:', error);
      throw error;
    }
  }

  // AJOUTER LA MÉTHODE POUR RECHERCHER PAR DEVISE
  async findByDevise(devise) {
    try {
      const articles = await db('articles')
        .where('devise', devise)
        .andWhere('actif', true)
        .select('*');
      
      return articles;
    } catch (error) {
      console.error('Erreur ArticleRepository.findByDevise:', error);
      throw new Error('Erreur lors de la récupération des articles par devise');
    }
  }

  async findWithStockInfo() {
    try {
      const articles = await db('articles')
        .select('*')
        .orderBy('code_article', 'asc');
      
      // Ajouter le statut calculé
      return articles.map(article => ({
        ...article,
        statut_stock: this.calculerStatutStock(article.quantite_stock, article.seuil_alerte)
      }));
    } catch (error) {
      console.error('Erreur ArticleRepository.findWithStockInfo:', error);
      throw new Error('Erreur lors de la récupération des articles avec info stock');
    }
  }

  async findByStockStatus(statut) {
    try {
      const articles = await db('articles')
        .select('*')
        .where('actif', true);

      return articles.filter(article => {
        const statutArticle = this.calculerStatutStock(article.quantite_stock, article.seuil_alerte);
        return statutArticle === statut;
      });
    } catch (error) {
      console.error('Erreur ArticleRepository.findByStockStatus:', error);
      throw new Error('Erreur lors de la récupération par statut stock');
    }
  }

  calculerStatutStock(quantite, seuil) {
    if (quantite <= 0) return 'rupture';
    if (quantite <= seuil) return 'stock_faible';
    return 'disponible';
  }
}

export default ArticleRepository;