import knex from 'knex';
import knexConfig from '../../../knexfile.js';

const environment = process.env.NODE_ENV || 'production';
const config = knexConfig[environment];

// Logs détaillés
console.log('🔧 ========== DATABASE CONFIG ==========');
console.log('🔧 Environment:', environment);
console.log('🔧 Host:', config.connection.host);
console.log('🔧 Database:', config.connection.database);
console.log('🔧 User:', config.connection.user);
console.log('🔧 Port:', config.connection.port);
console.log('🔧 SSL:', config.connection.ssl);
console.log('🔧 Timeout:', config.connection.connectTimeout);
console.log('🔧 Vercel:', process.env.VERCEL ? 'YES' : 'NO');
console.log('🔧 DB_HOST from env:', process.env.DB_HOST);
console.log('🔧 =====================================');

export const db = knex(config);

export const testConnection = async () => {
  try {
    console.log('🔍 Testing database connection to:', config.connection.host);
    const result = await db.raw('SELECT 1');
    console.log('✅ Database connection SUCCESS');
    return true;
  } catch (error) {
    console.error('❌ Database connection FAILED:');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    console.error('   Host:', config.connection.host);
    return false;
  }
};

export default db;