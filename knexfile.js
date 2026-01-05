import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Fonction pour obtenir le host correct
const getDatabaseHost = () => {
  const host = process.env.DB_HOST || '';
  
  // Si c'est le hostname AlwaysData, utiliser l'IP fixe
  if (host === 'mysql-omniserve-experts.alwaysdata.net') {
    console.log('🎯 Configuration: Utilisation IP fixe pour AlwaysData');
    return '185.31.40.43'; // IP de mysql1.paris1.alwaysdata.com
  }
  
  // Si c'est déjà une IP, la garder
  if (host.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    console.log('🎯 Configuration: Utilisation IP directe');
    return host;
  }
  
  // Sinon, garder le hostname
  console.log('🎯 Configuration: Utilisation hostname:', host);
  return host;
};

// Configuration SSL pour AlwaysData
const getSslConfig = () => {
  // Toujours FALSE pour AlwaysData (ils ne supportent pas SSL)
  if (process.env.DB_HOST && process.env.DB_HOST.includes('alwaysdata')) {
    console.log('🔓 Configuration: SSL désactivé pour AlwaysData');
    return false;
  }
  
  // Si DB_SSL est explicitement false, pas de SSL
  if (process.env.DB_SSL === 'false' || process.env.DB_SSL === false) {
    console.log('🔓 Configuration: SSL désactivé');
    return false;
  }
  
  // Si DB_SSL_CA_BASE64 est fourni, utiliser SSL Aiven
  if (process.env.DB_SSL_CA_BASE64) {
    console.log('🔐 Configuration: SSL avec certificat base64 (Aiven)');
    return {
      ca: Buffer.from(process.env.DB_SSL_CA_BASE64, 'base64').toString('utf8'),
      rejectUnauthorized: true
    };
  }
  
  // Pour Vercel + AlwaysData, SSL doit être false
  if (process.env.VERCEL && process.env.DB_HOST && process.env.DB_HOST.includes('alwaysdata')) {
    console.log('🔓 Configuration: SSL désactivé pour Vercel + AlwaysData');
    return false;
  }
  
  // Sinon, pas de SSL par défaut
  console.log('ℹ️ Configuration: Pas de SSL par défaut');
  return undefined;
};

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: getDatabaseHost() || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
      ssl: getSslConfig(),
      // Timeout plus long pour les connexions distantes
      connectTimeout: 10000,
      charset: 'utf8mb4',
      // Options importantes pour MySQL
      typeCast: function (field, next) {
        if (field.type === 'TINY' && field.length === 1) {
          return field.string() === '1';
        }
        return next();
      }
    },
    pool: { 
      min: 1, 
      max: 5,
      acquireTimeoutMillis: 10000,
      createTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      createRetryIntervalMillis: 200
    },
    debug: process.env.DB_DEBUG === 'true'
  },

  production: {
    client: 'mysql2',
    connection: {
      host: getDatabaseHost(), // Utilise l'IP fixe pour AlwaysData
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: getSslConfig(), // FALSE pour AlwaysData
      connectTimeout: 15000,
      charset: 'utf8mb4',
      // Options critiques pour Vercel
      typeCast: function (field, next) {
        if (field.type === 'TINY' && field.length === 1) {
          return field.string() === '1';
        }
        return next();
      },
      // Support des décimales
      decimalNumbers: true
    },
    pool: { 
      min: 0, 
      max: 7,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      idleTimeoutMillis: 60000,
      createRetryIntervalMillis: 200
    },
    debug: process.env.DB_DEBUG === 'true'
  }
};