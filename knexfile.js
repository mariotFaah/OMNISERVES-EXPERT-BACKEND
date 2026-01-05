import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// FORÇONS l'IP pour AlwaysData - solution radicale
const getDatabaseHost = () => {
  // SUR VERCEL, utilisez TOUJOURS l'IP pour AlwaysData
  if (process.env.VERCEL) {
    console.log('🚀 Vercel détecté - Utilisation IP forcée pour AlwaysData');
    return '185.31.40.43'; // IP fixe AlwaysData
  }
  
  // Sinon en local, utilisez le hostname ou l'IP
  const host = process.env.DB_HOST || '';
  
  if (host.includes('alwaysdata')) {
    console.log('🎯 AlwaysData détecté - Utilisation IP fixe');
    return '185.31.40.43';
  }
  
  return host || 'localhost';
};

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: getDatabaseHost(),
      port: 3306,
      user: process.env.DB_USER || '449542',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'omniserve-experts_bd',
      ssl: false, // Toujours false pour AlwaysData
      connectTimeout: 15000,
      charset: 'utf8mb4',
      decimalNumbers: true
    },
    pool: {
      min: 0,
      max: 5,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      idleTimeoutMillis: 30000
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host: getDatabaseHost(), // Utilise l'IP en production sur Vercel
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: false, // IMPORTANT: false pour AlwaysData
      connectTimeout: 20000, // Timeout plus long pour Vercel
      charset: 'utf8mb4',
      decimalNumbers: true,
      // Options pour meilleure compatibilité
      typeCast: function (field, next) {
        if (field.type === 'TINY' && field.length === 1) {
          return field.string() === '1';
        }
        return next();
      }
    },
    pool: {
      min: 0,
      max: 7,
      acquireTimeoutMillis: 60000,
      createTimeoutMillis: 60000,
      idleTimeoutMillis: 60000,
      createRetryIntervalMillis: 200
    }
  }
};