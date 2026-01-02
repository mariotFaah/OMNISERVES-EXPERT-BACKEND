// src/core/database/connection.js
import knex from 'knex';
import knexConfig from '../../../knexfile.js';
import fs from 'fs';

const environment = process.env.NODE_ENV || 'production';
const config = knexConfig[environment];

// S'assurer que le certificat SSL est chargé
if (process.env.DB_SSL_CA) {
  try {
    const sslCA = fs.readFileSync(process.env.DB_SSL_CA);
    config.connection.ssl = { ca: sslCA };
    console.log('📄 Certificat SSL chargé depuis:', process.env.DB_SSL_CA);
  } catch (error) {
    console.warn('⚠️ Impossible de charger le certificat SSL:', error.message);
  }
}

export const db = knex(config);

// Test de connexion amélioré
export const testConnection = async () => {
  try {
    // CORRECTION ICI : utiliser backticks pour `database`
    const result = await db.raw('SELECT 1 as test, NOW() as time, DATABASE() as `database`');
    console.log('✅ Connexion TiDB établie avec succès');
    console.log('📊 Détails:', result[0][0]);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion TiDB:', error.message);
    
    // Log d'erreur détaillé pour débogage
    console.error('🔧 Détails de configuration:', {
      host: config.connection.host,
      port: config.connection.port,
      user: config.connection.user,
      database: config.connection.database,
      ssl: config.connection.ssl ? 'Configuré' : 'Non configuré'
    });
    
    return false;
  }
};

export default db;