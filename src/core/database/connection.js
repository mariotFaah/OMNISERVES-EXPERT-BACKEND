import knex from 'knex';
import knexConfig from '../../../knexfile.js';

const environment = process.env.NODE_ENV || 'production';
const config = knexConfig[environment];

if (process.env.DB_SSL_CA_BASE64) {
  config.connection.ssl = {
    ca: Buffer.from(process.env.DB_SSL_CA_BASE64, 'base64').toString('utf8'),
    rejectUnauthorized: true, // Vérifie que le certificat est valide
  };
  console.log('🔐 Certificat SSL chargé depuis DB_SSL_CA_BASE64');
} else {
  console.warn('⚠️ DB_SSL_CA_BASE64 non défini ! Les connexions vont échouer');
}

export const db = knex(config);

export const testConnection = async () => {
  try {
    const result = await db.raw('SELECT 1 AS test, NOW() AS time, DATABASE() AS `database`');
    console.log('✅ Connexion TiDB établie avec succès');
    console.log('📊 Détails:', result[0][0]);
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion TiDB:', error.message);
    console.error('🔧 SSL:', config.connection.ssl ? 'OK' : 'ABSENT');
    return false;
  }
};

export default db;
