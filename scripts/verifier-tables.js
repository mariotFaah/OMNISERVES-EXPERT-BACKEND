import db from '../src/core/database/connection.js';

async function verifierTables() {
  console.log('🔍 Vérification des tables...');
  
  try {
    // Vérifier si la table plan_comptable existe
    const tables = await db.raw(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'aquatiko' 
      AND TABLE_NAME = 'plan_comptable'
    `);
    
    if (tables[0].length > 0) {
      console.log('✅ Table plan_comptable existe');
      
      // Compter les lignes
      const count = await db('plan_comptable').count('* as total');
      console.log(`📊 ${count[0].total} comptes dans la table`);
      
    } else {
      console.log('❌ Table plan_comptable n\'existe pas');
    }
    
  } catch (error) {
    console.error('❌ Erreur vérification tables:', error.message);
  } finally {
    db.destroy();
  }
}

verifierTables();
