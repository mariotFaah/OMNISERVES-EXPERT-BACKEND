#!/bin/bash

# Liste des fichiers à corriger
FILES=$(grep -r "authMiddleware" src/modules/ --include="*.js" -l)

for file in $FILES; do
  echo "Correction de $file"
  # Remplacer l'import
  sed -i 's|import authMiddleware from .../../auth/middleware/authMiddleware.js.;|import { auth, requireRole } from .../../../core/middleware/auth.js.;|g' "$file"
  # Remplacer les utilisations
  sed -i 's|authMiddleware.authenticate|auth|g' "$file"
  sed -i 's|authMiddleware.requirePermission.*|// TODO: Remplacer par requireRole|g' "$file"
  sed -i 's|authMiddleware.requireRole|requireRole|g' "$file"
done

echo "Correction terminée"
