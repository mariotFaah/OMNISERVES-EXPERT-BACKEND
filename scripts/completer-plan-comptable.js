import db from '../src/core/database/connection.js';

async function completerPlanComptable() {
  console.log('🚀 Complétion du plan comptable...');
  
  try {
    // Ajouter la colonne type si elle n'existe pas
    const colonnes = await db.raw(`DESCRIBE plan_comptable`);
    const colonneTypeExiste = colonnes[0].some(col => col.Field === 'type');
    
    if (!colonneTypeExiste) {
      await db.raw(`ALTER TABLE plan_comptable ADD COLUMN type VARCHAR(20)`);
      console.log('✅ Colonne "type" ajoutée');
    }
    
    // Vider la table et réinsérer les données
    await db('plan_comptable').del();
    console.log('🗑️  Anciennes données supprimées');
    
    // Insérer les comptes de base
    const comptes = [
      // Comptes de tiers
      { numero_compte: '411000', libelle: 'Clients', categorie: 'client', type: 'classe4' },
      { numero_compte: '401000', libelle: 'Fournisseurs', categorie: 'fournisseur', type: 'classe4' },
      
      // Comptes de TVA
      { numero_compte: '445700', libelle: 'TVA à payer', categorie: 'tva', type: 'classe4' },
      { numero_compte: '445600', libelle: 'TVA déductible', categorie: 'tva', type: 'classe4' },
      
      // Comptes de produits/charges
      { numero_compte: '701000', libelle: 'Ventes de marchandises', categorie: 'vente', type: 'classe7' },
      { numero_compte: '607000', libelle: 'Achats de marchandises', categorie: 'achat', type: 'classe6' },
      
      // Comptes de trésorerie
      { numero_compte: '512000', libelle: 'Banque', categorie: 'banque', type: 'classe5' },
      { numero_compte: '531000', libelle: 'Caisse', categorie: 'caisse', type: 'classe5' },
    ];
    
    await db('plan_comptable').insert(comptes);
    console.log(`✅ ${comptes.length} comptes insérés`);
    
    // Afficher le résultat
    const resultats = await db('plan_comptable').select('*');
    console.log('📊 Plan comptable final:');
    resultats.forEach(compte => {
      console.log(`  - ${compte.numero_compte}: ${compte.libelle} (${compte.categorie})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur complétion plan comptable:', error);
  } finally {
    db.destroy();
  }
}

completerPlanComptable();
