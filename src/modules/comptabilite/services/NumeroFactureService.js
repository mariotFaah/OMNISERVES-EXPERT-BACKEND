// src/modules/comptabilite/services/NumeroFactureService.js
import { db } from '../../../core/database/connection.js';

export class NumeroFactureService {
  
  constructor() {
    this.prefixes = {
      'facture': 'INV',
      'proforma': 'PRO', 
      'avoir': 'AVO'
    };
  }
  
  async genererNumero(type = 'facture', date = new Date()) {
    try {
      const annee = date.getFullYear();
      const prefixe = this.prefixes[type] || 'DOC';
      
      // Rechercher la dernière séquence pour ce type et cette année
      const result = await db('factures')
        .where('type_facture', type)
        .whereRaw('YEAR(date) = ?', [annee])
        .max('numero_facture as dernier_numero')
        .first();
      
      let sequence = 1;
      
      if (result.dernier_numero) {
        // Vérifier si c'est déjà un format international
        const match = result.dernier_numero.match(new RegExp(`^${prefixe}/${annee}/(\\d+)$`));
        if (match) {
          sequence = parseInt(match[1]) + 1;
        } else {
          // Si ancien format, chercher la plus haute séquence
          const allNumbers = await db('factures')
            .where('type_facture', type)
            .whereRaw('YEAR(date) = ?', [annee])
            .select('numero_facture');
          
          const sequences = allNumbers
            .map(num => {
              const m = num.numero_facture.match(new RegExp(`^${prefixe}/${annee}/(\\d+)$`));
              return m ? parseInt(m[1]) : 0;
            })
            .filter(seq => seq > 0);
          
          sequence = sequences.length > 0 ? Math.max(...sequences) + 1 : 1;
        }
      }
      
      // Formater la séquence
      const sequenceFormatee = sequence.toString().padStart(3, '0');
      
      // Construire le numéro international
      const numeroInternational = `${prefixe}/${annee}/${sequenceFormatee}`;
      
      console.log(`🔢 Numéro ${type} généré: ${numeroInternational}`);
      
      return numeroInternational;
      
    } catch (error) {
      console.error('❌ Erreur génération numéro facture:', error);
      throw new Error('Impossible de générer le numéro de facture');
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
}

export default NumeroFactureService;