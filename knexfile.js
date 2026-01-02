import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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
      // SSL en local si fichier fourni
      ssl: process.env.DB_SSL_CA
        ? { ca: fs.readFileSync(process.env.DB_SSL_CA, 'utf8') }
        : undefined
    },
    pool: { min: 2, max: 10 }
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 17165, // Port Aiven Free Tier
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // SSL avec Base64 pour Vercel
      ssl: process.env.DB_SSL_CA_BASE64
        ? {
            ca: Buffer.from(process.env.DB_SSL_CA_BASE64, 'base64').toString('utf8'),
            rejectUnauthorized: true
          }
        : undefined
    },
    pool: { min: 0, max: 5 }
  }
};
