// src/modules/comptabilite/services/NumeroFactureService.js - VERSION NUMERO_COMPLET
import { db } from '../../../core/database/connection.js';

export class NumeroFactureService {
  
  constructor() {
    this.prefixes = {
      'facture': 'INV',
      'proforma': 'PRO', 
      'avoir': 'AVO'
    };
  }
  
  // Dans NumeroFactureService.js
async genererNumero(type = 'facture', date = new Date()) {
  try {
    const annee = date.getFullYear();
    const prefixe = this.prefixes[type] || 'DOC';
    
    console.log(`🔢 Début génération numéro: type=${type}, année=${annee}, préfixe=${prefixe}`);
    console.log(`📅 Date fournie: ${date}, Année extraite: ${annee}`);
    
    // CORRECTION: Rechercher dans la colonne numero_complet
    const result = await db('factures')
      .where('type_facture', type)
      .whereRaw('YEAR(date) = ?', [annee])
      .whereNotNull('numero_complet')
      .max('numero_complet as dernier_numero')
      .first();
    
    console.log(`📊 Résultat requête:`, result);
    
    let sequence = 1;
    
    if (result && result.dernier_numero) {
      console.log(`📈 Dernier numéro trouvé: ${result.dernier_numero}`);
      // Vérifier si c'est déjà un format international
      const match = result.dernier_numero.match(new RegExp(`^${prefixe}/${annee}/(\\d+)$`));
      if (match) {
        sequence = parseInt(match[1]) + 1;
        console.log(`🔢 Séquence trouvée: ${match[1]}, nouvelle: ${sequence}`);
      } else {
        // Si format différent, chercher toutes les séquences
        const allNumbers = await db('factures')
          .where('type_facture', type)
          .whereRaw('YEAR(date) = ?', [annee])
          .whereNotNull('numero_complet')
          .select('numero_complet');
        
        console.log(`🔍 ${allNumbers.length} numéros trouvés pour ${type}/${annee}`);
        
        const sequences = allNumbers
          .map(num => {
            const m = num.numero_complet.match(new RegExp(`^${prefixe}/${annee}/(\\d+)$`));
            return m ? parseInt(m[1]) : 0;
          })
          .filter(seq => seq > 0);
        
        sequence = sequences.length > 0 ? Math.max(...sequences) + 1 : 1;
        console.log(`📊 ${sequences.length} séquences valides, max: ${Math.max(...sequences) || 0}`);
      }
    } else {
      console.log(`🆕 Première facture de type ${type} en ${annee} ou pas de numero_complet`);
    }
    
    // Formater la séquence
    const sequenceFormatee = sequence.toString().padStart(3, '0');
    const numeroInternational = `${prefixe}/${annee}/${sequenceFormatee}`;
    
    console.log(`✅ Numéro final généré: ${numeroInternational}`);
    
    return numeroInternational;
    
  } catch (error) {
    console.error('❌ Erreur génération numéro facture:', error);
    throw new Error(`Impossible de générer le numéro de facture: ${error.message}`);
  }
}
  
  // Vérifier si un numéro est valide
  validerFormat(numero) {
    const pattern = /^[A-Z]{3}\/\d{4}\/\d{3}$/;
    return pattern.test(numero);
  }
  
  // Extraire les composants d'un numéro
  extraireComposants(numero) {
    if (!this.validerFormat(numero)) {
      return null;
    }
    
    const [prefixe, annee, sequence] = numero.split('/');
    
    return {
      prefixe,
      annee: parseInt(annee),
      sequence: parseInt(sequence),
      type: this.getTypeFromPrefix(prefixe)
    };
  }
  
  getTypeFromPrefix(prefixe) {
    for (const [type, pref] of Object.entries(this.prefixes)) {
      if (pref === prefixe) {
        return type;
      }
    }
    return 'document';
  }
  
  // Générer un numéro lisible pour l'affichage
  formaterPourAffichage(numero) {
    const composants = this.extraireComposants(numero);
    if (!composants) return numero;
    
    const types = {
      'INV': 'Facture',
      'PRO': 'Proforma',
      'AVO': 'Avoir'
    };
    
    const typeLisible = types[composants.prefixe] || composants.prefixe;
    
    return `${typeLisible} ${composants.annee}-${composants.sequence.toString().padStart(3, '0')}`;
  }

  // NOUVELLE MÉTHODE: Migrer les anciennes factures
  async migrerAnciennesFactures() {
    try {
      console.log('🔄 Début migration des anciennes factures...');
      
      const factures = await db('factures')
        .whereNull('numero_complet')
        .select('*');
      
      console.log(`📊 ${factures.length} factures à migrer`);
      
      for (const facture of factures) {
        const prefixe = this.prefixes[facture.type_facture] || 'DOC';
        const annee = new Date(facture.date).getFullYear();
        
        // Pour les anciennes factures, on garde leur numéro_facture comme séquence
        const sequence = facture.numero_facture;
        const numeroComplet = `${prefixe}/${annee}/${sequence.toString().padStart(3, '0')}`;
        
        await db('factures')
          .where('numero_facture', facture.numero_facture)
          .update({ numero_complet: numeroComplet });
        
        console.log(`✅ Migré: ${facture.numero_facture} → ${numeroComplet}`);
      }
      
      console.log('🎉 Migration terminée');
      
    } catch (error) {
      console.error('❌ Erreur migration:', error);
    }
  }
}

export default NumeroFactureService;