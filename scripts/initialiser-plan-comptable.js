import db from '../src/core/database/connection.js';

const comptesBase = [
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
  
  // Autres comptes nécessaires
  { numero_compte: '101000', libelle: 'Capital', categorie: 'capital', type: 'classe1' },
  { numero_compte: '120000', libelle: 'Résultat de l\'exercice', categorie: 'resultat', type: 'classe1' }
];

async function initialiserPlanComptable() {
  console.log('🚀 Initialisation du plan comptable...');
  
  try {
    // Vérifier quels comptes existent déjà
    const comptesExistants = await db('plan_comptable').select('numero_compte');
    const numerosExistants = comptesExistants.map(c => c.numero_compte);
    
    const comptesAAjouter = comptesBase.filter(compte => 
      !numerosExistants.includes(compte.numero_compte)
    );
    
    console.log(`📊 ${comptesAAjouter.length} comptes à ajouter sur ${comptesBase.length}`);
    
    if (comptesAAjouter.length > 0) {
      await db('plan_comptable').insert(comptesAAjouter);
      console.log('✅ Plan comptable initialisé avec succès !');
      
      // Afficher les comptes ajoutés
      comptesAAjouter.forEach(compte => {
        console.log(`   ➕ ${compte.numero_compte}: ${compte.libelle} (${compte.categorie})`);
      });
    } else {
      console.log('✅ Plan comptable déjà à jour');
    }
    
  } catch (error) {
    console.error('❌ Erreur initialisation plan comptable:', error);
  } finally {
    db.destroy();
  }
}

initialiserPlanComptable();
