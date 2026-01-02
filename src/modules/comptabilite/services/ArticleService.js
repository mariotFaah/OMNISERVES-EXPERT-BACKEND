import { ArticleRepository } from '../repositories/ArticleRepository.js';

export class ArticleService {
  constructor() {
    this.articleRepository = new ArticleRepository();
  }

  // Récupérer tous les articles
  async getArticles() {
    try {
      return await this.articleRepository.findWithStockInfo();
    } catch (error) {
      console.error('Erreur ArticleService.getArticles:', error);
      throw new Error('Erreur lors de la récupération des articles');
    }
  }

  // Récupérer un article par code
  async getArticleByCode(code_article) {
    try {
      const article = await this.articleRepository.findByCode(code_article);
      
      if (!article) {
        throw new Error('Article non trouvé');
      }

      // Ajouter le statut stock
      return {
        ...article,
        statut_stock: this.calculerStatutStock(article.quantite_stock, article.seuil_alerte)
      };
    } catch (error) {
      console.error('Erreur ArticleService.getArticleByCode:', error);
      throw new Error(`Erreur lors de la récupération de l'article: ${error.message}`);
    }
  }

  // Créer un nouvel article
  async createArticle(articleData) {
    try {
      // Vérifier si le code existe déjà
      const codeExists = await this.articleRepository.codeExists(articleData.code_article);
      if (codeExists) {
        throw new Error('Un article avec ce code existe déjà');
      }

      return await this.articleRepository.create(articleData);
    } catch (error) {
      console.error('Erreur ArticleService.createArticle:', error);
      throw new Error(`Erreur lors de la création de l'article: ${error.message}`);
    }
  }

  // Mettre à jour un article
  async updateArticle(code_article, articleData) {
    try {
      // Vérifier que l'article existe
      const existingArticle = await this.articleRepository.findByCode(code_article);
      if (!existingArticle) {
        throw new Error('Article non trouvé');
      }

      return await this.articleRepository.update(code_article, articleData);
    } catch (error) {
      console.error('Erreur ArticleService.updateArticle:', error);
      throw new Error(`Erreur lors de la mise à jour de l'article: ${error.message}`);
    }
  }

  // Supprimer un article
  async deleteArticle(code_article) {
    try {
      const article = await this.articleRepository.findByCode(code_article);
      
      if (!article) {
        throw new Error('Article non trouvé');
      }

      return await this.articleRepository.delete(code_article);
    } catch (error) {
      console.error('Erreur ArticleService.deleteArticle:', error);
      throw new Error(`Erreur lors de la suppression de l'article: ${error.message}`);
    }
  }

  async getArticlesByStockStatus(statut) {
    try {
      return await this.articleRepository.findByStockStatus(statut);
    } catch (error) {
      console.error('Erreur ArticleService.getArticlesByStockStatus:', error);
      throw new Error(`Erreur lors de la récupération des articles par statut: ${error.message}`);
    }
  }

  async updateStock(code_article, quantite_stock) {
    try {
      const article = await this.articleRepository.findByCode(code_article);
      
      if (!article) {
        throw new Error('Article non trouvé');
      }

      if (quantite_stock < 0) {
        throw new Error('La quantité en stock ne peut pas être négative');
      }

      return await this.articleRepository.update(code_article, { 
        quantite_stock,
        updated_at: new Date()
      });
    } catch (error) {
      console.error('Erreur ArticleService.updateStock:', error);
      throw new Error(`Erreur lors de la mise à jour du stock: ${error.message}`);
    }
  }

  // AJOUTER CES DEUX MÉTHODES :
  async adjustStock(code_article, quantite) {
    try {
      const article = await this.articleRepository.findByCode(code_article);
      
      if (!article) {
        throw new Error('Article non trouvé');
      }

      const nouveauStock = article.quantite_stock + quantite;
      
      if (nouveauStock < 0) {
        throw new Error('Stock insuffisant');
      }

      return await this.articleRepository.update(code_article, { 
        quantite_stock: nouveauStock,
        updated_at: new Date()
      });
    } catch (error) {
      console.error('Erreur ArticleService.adjustStock:', error);
      throw new Error(`Erreur lors de l'ajustement du stock: ${error.message}`);
    }
  }

  async checkAvailability(code_article, quantiteDemandee = 1) {
    try {
      const article = await this.articleRepository.findByCode(code_article);
      
      if (!article) {
        throw new Error('Article non trouvé');
      }

      return {
        disponible: article.quantite_stock >= quantiteDemandee,
        quantite_stock: article.quantite_stock,
        quantite_demandee: quantiteDemandee,
        statut: this.calculerStatutStock(article.quantite_stock, article.seuil_alerte),
        message: article.quantite_stock >= quantiteDemandee 
          ? `Stock suffisant (${article.quantite_stock} disponible(s))`
          : `Stock insuffisant (${article.quantite_stock} disponible(s), ${quantiteDemandee} demandé(s))`
      };
    } catch (error) {
      console.error('Erreur ArticleService.checkAvailability:', error);
      throw new Error(`Erreur lors de la vérification de disponibilité: ${error.message}`);
    }
  }

  calculerStatutStock(quantite, seuil) {
    if (quantite <= 0) return 'rupture';
    if (quantite <= seuil) return 'stock_faible';
    return 'disponible';
  }
}

export default ArticleService;