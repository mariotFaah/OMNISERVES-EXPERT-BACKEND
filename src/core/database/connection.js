import knex from 'knex';
import knexConfig from '../../../knexfile.js';

const environment = process.env.NODE_ENV || 'production';
const config = knexConfig[environment];

console.log('🔧 Configuration DB utilisée:', {
  host: config.connection.host,
  port: config.connection.port,
  database: config.connection.database,
  user: config.connection.user,
  ssl: config.connection.ssl,
  vercel: process.env.VERCEL ? 'OUI' : 'NON'
});

export const db = knex(config);

export const testConnection = async () => {
  try {
    const result = await db.raw('SELECT 1 AS test, NOW() AS time, DATABASE() AS `database`, VERSION() as version');
    console.log('✅ Connexion base de données établie avec succès');
    console.log('📊 Détails:', {
      database: result[0][0].database,
      time: result[0][0].time,
      version: result[0][0].version,
      host: config.connection.host,
      ssl: config.connection.ssl ? 'ACTIVÉ' : 'DÉSACTIVÉ'
    });
    return {
      success: true,
      data: result[0][0],
      host: config.connection.host
    };
  } catch (error) {
    console.error('❌ Erreur de connexion base de données:', error.message);
    console.error('🔧 Configuration complète:', {
      host: config.connection.host,
      port: config.connection.port,
      database: config.connection.database,
      user: config.connection.user,
      ssl: config.connection.ssl,
      env: process.env.NODE_ENV
    });
    console.error('🔧 Variables d\'environnement:', {
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME,
      VERCEL: process.env.VERCEL
    });
    return {
      success: false,
      error: error.message,
      host: config.connection.host
    };
  }
};

export default db;