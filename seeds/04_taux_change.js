// seeds/04_taux_change.js
export async function seed(knex) {
  await knex('taux_change').del();
  
  const aujourdhui = new Date();
  
  await knex('taux_change').insert([
    {
      devise_source: 'EUR',
      devise_cible: 'MGA',
      taux: 4500.00,
      date_effet: aujourdhui,
      actif: true
    },
    {
      devise_source: 'USD', 
      devise_cible: 'MGA',
      taux: 4200.00,
      date_effet: aujourdhui,
      actif: true
    },
    {
      devise_source: 'MGA',
      devise_cible: 'EUR', 
      taux: 0.000222,
      date_effet: aujourdhui,
      actif: true
    },
    {
      devise_source: 'MGA',
      devise_cible: 'USD',
      taux: 0.000238,
      date_effet: aujourdhui, 
      actif: true
    },
    {
      devise_source: 'EUR',
      devise_cible: 'USD',
      taux: 1.07,
      date_effet: aujourdhui,
      actif: true
    },
    {
      devise_source: 'USD',
      devise_cible: 'EUR',
      taux: 0.93,
      date_effet: aujourdhui,
      actif: true
    }
  ]);
}