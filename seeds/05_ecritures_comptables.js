// seeds/05_ecritures_comptables.js
export async function seed(knex) {
  await knex('ecritures_comptables').del();
  
  const aujourdhui = new Date();
  const prefix = `${aujourdhui.getFullYear()}${String(aujourdhui.getMonth() + 1).padStart(2, '0')}`;
  
  await knex('ecritures_comptables').insert([
    {
      numero_ecriture: `${prefix}-TEST-001`,
      date: aujourdhui,
      journal: 'ventes',
      compte: '701000',
      libelle: 'Vente de test',
      debit: 0,
      credit: 1000000,
      devise: 'MGA',
      taux_change: 1,
      reference: 'TEST'
    },
    {
      numero_ecriture: `${prefix}-TEST-002`, 
      date: aujourdhui,
      journal: 'ventes',
      compte: '445710',
      libelle: 'TVA collectée',
      debit: 0,
      credit: 200000,
      devise: 'MGA', 
      taux_change: 1,
      reference: 'TEST'
    }
  ]);
}