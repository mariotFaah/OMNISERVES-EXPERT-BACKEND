// knexfile.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      // ✅ SSL fichier EN LOCAL seulement
      ssl: process.env.DB_SSL_CA
        ? { ca: require('fs').readFileSync(process.env.DB_SSL_CA) }
        : undefined
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: 4000, // 🔥 OBLIGATOIRE TiDB
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      // 🔐 SSL Base64 (Vercel)
      ssl: {
        ca: Buffer.from(
          process.env.DB_SSL_CA_BASE64,
          'base64'
        ).toString('utf8'),
        rejectUnauthorized: true
      }
    },
    pool: {
      min: 0,
      max: 5
    }
  }
};
