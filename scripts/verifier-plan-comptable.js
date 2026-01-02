import db from '../src/core/database/connection.js';

async function verifierPlanComptable() {
  console.log('🔍 Vérification du plan comptable...');
  
  try {
    const comptes = await db('plan_comptable').select('*');
    console.log(`📊 ${comptes.length} comptes trouvés dans le plan comptable:`);
    
    comptes.forEach(compte => {
      console.log(`  - ${compte.numero_compte}: ${compte.libelle} (${compte.categorie})`);
    });

    // Vérifier les catégories nécessaires
    const categoriesRequises = ['client', 'fournisseur', 'tva', 'achat', 'vente', 'banque', 'caisse'];
    
    for (const categorie of categoriesRequises) {
      const compte = await db('plan_comptable').where('categorie', categorie).first();
      if (compte) {
        console.log(`✅ ${categorie}: ${compte.numero_compte} - ${compte.libelle}`);
      } else {
        console.log(`❌ ${categorie}: COMPTE MANQUANT`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur vérification plan comptable:', error);
  } finally {
    db.destroy();
  }
}

verifierPlanComptable();
