import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Configuration générique pour MySQL
const getSslConfig = () => {
  // Si DB_SSL est explicitement false, pas de SSL
  if (process.env.DB_SSL === 'false' || process.env.DB_SSL === false) {
    console.log('🔓 Configuration: SSL désactivé (AlwaysData)');
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
  
  // Sinon, pas de SSL par défaut
  console.log('ℹ️ Configuration: Pas de SSL par défaut');
  return undefined;
};

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
      ssl: getSslConfig(),
      // Timeout plus long pour les connexions distantes
      connectTimeout: 10000,
      charset: 'utf8mb4'
    },
    pool: { 
      min: 1, 
      max: 5,
      acquireTimeoutMillis: 10000,
      createTimeoutMillis: 10000,
      idleTimeoutMillis: 30000
    },
    debug: process.env.DB_DEBUG === 'true'
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306, // AlwaysData utilise 3306
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: getSslConfig(), // Utilise la même logique
      connectTimeout: 15000,
      charset: 'utf8mb4'
    },
    pool: { 
      min: 0, 
      max: 7,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      idleTimeoutMillis: 60000
    },
    debug: process.env.DB_DEBUG === 'true'
  }
};