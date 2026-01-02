import db from '../src/core/database/connection.js';

async function verifierStructure() {
  console.log('🔍 Vérification structure table plan_comptable...');
  
  try {
    const structure = await db.raw(`
      DESCRIBE plan_comptable
    `);
    
    console.log('📋 Structure de la table:');
    structure[0].forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur vérification structure:', error);
  } finally {
    db.destroy();
  }
}

verifierStructure();
