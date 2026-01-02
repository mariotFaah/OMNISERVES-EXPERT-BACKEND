// src/core/utils/response.js

// === RÉPONSES DE SUCCÈS ===

// Version principale
export const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message: message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const createdResponse = (res, message, data = null) => {
  return successResponse(res, message, data, 201);
};

// === RÉPONSES D'ERREUR ===

// Version principale
export const errorResponse = (res, message, statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message: message
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

export const unauthorizedResponse = (res, message = 'Non autorisé') => {
  return errorResponse(res, message, 401);
};

export const forbiddenResponse = (res, message = 'Accès refusé') => {
  return errorResponse(res, message, 403);
};

export const notFoundResponse = (res, message = 'Ressource non trouvée') => {
  return errorResponse(res, message, 404);
};

export const serverErrorResponse = (res, message = 'Erreur interne du serveur') => {
  return errorResponse(res, message, 500);
};

// === ALIAS POUR COMPATIBILITÉ ===

// Pour UserManagementController
export const responseSuccess = successResponse;
export const responseError = errorResponse;
export const responseCreated = createdResponse;

// Pour TiersController
export const sendSuccess = successResponse;
export const sendError = errorResponse;

// Pour DeviseController

// Pour les autres contrôleurs qui pourraient utiliser d'autres noms
export const sendResponse = successResponse;
export const sendCreated = createdResponse;
export const sendNotFound = notFoundResponse;
export const sendServerError = serverErrorResponse;
export const sendForbidden = forbiddenResponse;
export const sendUnauthorized = unauthorizedResponse;

// === EXPORT PAR DÉFAUT ===
export default {
  // Succès
  successResponse,
  createdResponse,
  responseSuccess,
  responseCreated,
  sendSuccess,
  sendResponse,
  sendCreated,
  
  // Erreurs
  errorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
  responseError,
  sendError,
  sendNotFound,
  sendServerError,
  sendForbidden,
  sendUnauthorized
};