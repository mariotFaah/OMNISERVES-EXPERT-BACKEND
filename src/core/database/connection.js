import knex from 'knex';
import knexConfig from '../../../knexfile.js';

const environment = process.env.NODE_ENV || 'production';
const config = knexConfig[environment];

// IMPORTANT: Pour AlwaysData, SSL doit être FALSE
if (process.env.DB_SSL === 'false' || process.env.DB_SSL === false) {
  // Désactiver SSL pour AlwaysData
  if (config.connection) {
    config.connection.ssl = false;
  }
  console.log('🔓 SSL désactivé pour AlwaysData');
} else if (process.env.DB_SSL_CA_BASE64) {
  // Ancienne config Aiven (à conserver pour compatibilité)
  config.connection.ssl = {
    ca: Buffer.from(process.env.DB_SSL_CA_BASE64, 'base64').toString('utf8'),
    rejectUnauthorized: true,
  };
  console.log('🔐 Certificat SSL chargé depuis DB_SSL_CA_BASE64');
} else {
  console.log('ℹ️ Pas de configuration SSL spécifiée');
}

export const db = knex(config);

export const testConnection = async () => {
  try {
    const result = await db.raw('SELECT 1 AS test, NOW() AS time, DATABASE() AS `database`, VERSION() as version');
    console.log('✅ Connexion base de données établie avec succès');
    console.log('📊 Détails:', {
      database: result[0][0].database,
      time: result[0][0].time,
      version: result[0][0].version,
      ssl: config.connection.ssl ? 'ACTIVÉ' : 'DÉSACTIVÉ'
    });
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion base de données:', error.message);
    console.error('🔧 Configuration:', {
      host: config.connection.host,
      port: config.connection.port,
      database: config.connection.database,
      ssl: config.connection.ssl ? 'ACTIVÉ' : 'DÉSACTIVÉ'
    });
    console.error('🔧 DB_SSL variable:', process.env.DB_SSL);
    return false;
  }
};

export default db;