// src/modules/comptabilite/controllers/ArticleController.js
import { successResponse, errorResponse, createdResponse } from '../../../core/utils/response.js';
import { ArticleService } from '../services/ArticleService.js';

export class ArticleController {
  constructor() {
    this.articleService = new ArticleService();
  }

  async getAll(req, res) {
    try {
      const articles = await this.articleService.getArticles();
      successResponse(res, 'Articles récupérés avec succès', articles);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async create(req, res) {
    try {
      const nouvelArticle = await this.articleService.createArticle(req.body);
      createdResponse(res, 'Article créé avec succès', nouvelArticle);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getByCode(req, res) {
    try {
      const article = await this.articleService.getArticleByCode(req.params.code);
      if (!article) {
        return errorResponse(res, 'Article non trouvé', 404);
      }
      successResponse(res, 'Articles recuperee avec succes' ,article);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const articleMaj = await this.articleService.updateArticle(req.params.code, req.body);
      successResponse(res, 'Article mis à jour avec succès',articleMaj );
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      await this.articleService.deleteArticle(req.params.code);
      successResponse(res,'Article supprimé avec succès',null);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  // NOUVELLES MÉTHODES POUR LA GESTION DU STOCK
  async getByStockStatus(req, res) {
    try {
      const { statut } = req.params;
      const articles = await this.articleService.getArticlesByStockStatus(statut);
      successResponse(res, `Articles avec statut ${statut} récupérés avec succès`,articles);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async updateStock(req, res) {
    try {
      const { quantite_stock } = req.body;
      const articleMaj = await this.articleService.updateStock(req.params.code, quantite_stock);
      successResponse(res,'Stock mis à jour avec succès', articleMaj );
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async adjustStock(req, res) {
    try {
      const { quantite } = req.body;
      const articleMaj = await this.articleService.adjustStock(req.params.code, quantite);
      successResponse(res, 'Stock ajusté avec succès', articleMaj);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async getStockAlerts(req, res) {
    try {
      const rupture = await this.articleService.getArticlesByStockStatus('rupture');
      const stockFaible = await this.articleService.getArticlesByStockStatus('stock_faible');
      
      successResponse(res, 'Alertes stock récupérées avec succès', {
        rupture_stock: rupture,
        stock_faible: stockFaible,
        total_alertes: rupture.length + stockFaible.length
      });
    } catch (error) {
      errorResponse(res, error.message);
    }
  }

  async checkAvailability(req, res) {
    try {
      const { quantite } = req.query;
      const disponibilite = await this.articleService.checkAvailability(
        req.params.code, 
        quantite ? parseInt(quantite) : 1
      );
      successResponse(res, 'Disponibilité vérifiée avec succès', disponibilite);
    } catch (error) {
      errorResponse(res, error.message);
    }
  }
}

export default ArticleController;