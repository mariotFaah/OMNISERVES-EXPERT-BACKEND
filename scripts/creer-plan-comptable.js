import db from '../src/core/database/connection.js';

async function creerPlanComptable() {
  console.log('🚀 Création du plan comptable...');
  
  try {
    // Créer la table si elle n'existe pas
    await db.raw(`
      CREATE TABLE IF NOT EXISTS plan_comptable (
        id_compte INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        numero_compte VARCHAR(10) UNIQUE NOT NULL,
        libelle VARCHAR(255) NOT NULL,
        categorie VARCHAR(50),
        type VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Table plan_comptable créée ou déjà existante');
    
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
    
    for (const compte of comptes) {
      const existe = await db('plan_comptable')
        .where('numero_compte', compte.numero_compte)
        .first();
      
      if (!existe) {
        await db('plan_comptable').insert(compte);
        console.log(`➕ ${compte.numero_compte}: ${compte.libelle}`);
      }
    }
    
    console.log('✅ Plan comptable initialisé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur création plan comptable:', error);
  } finally {
    db.destroy();
  }

  
}

creerPlanComptable();
