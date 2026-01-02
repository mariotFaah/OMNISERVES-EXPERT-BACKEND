import bcrypt from 'bcryptjs';

export const seed = async function(knex) {
  // Vider les tables d'abord (dans le bon ordre)
  await knex('role_permissions').del();
  await knex('permissions').del();
  await knex('users').del();
  await knex('roles').del();

  // Insérer les rôles et récupérer leurs IDs manuellement
  await knex('roles').insert([
    {
      code_role: 'admin',
      nom_role: 'Administrateur',
      description: 'Accès complet au système'
    },
    {
      code_role: 'comptable', 
      nom_role: 'Comptable',
      description: 'Gestion de la comptabilité'
    },
    {
      code_role: 'commercial',
      nom_role: 'Commercial', 
      description: 'Gestion commerciale et CRM'
    }
  ]);

  // Récupérer les IDs des rôles insérés
  const roles = await knex('roles').select('id_role', 'code_role');
  const roleIds = {
    admin: roles.find(r => r.code_role === 'admin').id_role,
    comptable: roles.find(r => r.code_role === 'comptable').id_role,
    commercial: roles.find(r => r.code_role === 'commercial').id_role
  };

  const hashedPassword = await bcrypt.hash('password123', 12);
  
  // Insérer les utilisateurs avec les bons id_role
  await knex('users').insert([
    {
      email: 'admin@aquatiko.mg',
      nom: 'Admin',
      prenom: 'Principal',
      password_hash: hashedPassword,
      id_role: roleIds.admin,
      is_active: true
    },
    {
      email: 'comptable@aquatiko.mg',
      nom: 'Comptable', 
      prenom: 'Marie',
      password_hash: hashedPassword,
      id_role: roleIds.comptable,
      is_active: true
    },
    {
      email: 'commercial@aquatiko.mg',
      nom: 'Commercial',
      prenom: 'Pierre',
      password_hash: hashedPassword, 
      id_role: roleIds.commercial,
      is_active: true
    }
  ]);

  // Insérer des permissions de base
  await knex('permissions').insert([
    { module: 'comptabilite', action: 'read', description: 'Lecture des données comptables' },
    { module: 'comptabilite', action: 'write', description: 'Écriture des données comptables' },
    { module: 'crm', action: 'read', description: 'Lecture des données CRM' },
    { module: 'crm', action: 'write', description: 'Écriture des données CRM' },
    { module: 'import-export', action: 'read', description: 'Lecture des données import/export' },
    { module: 'import-export', action: 'write', description: 'Écriture des données import/export' },
    { module: 'admin', action: 'read', description: 'Accès administration' },
    { module: 'admin', action: 'write', description: 'Gestion administration' }
  ]);

  // Récupérer les IDs des permissions
  const permissions = await knex('permissions').select('id_permission', 'module', 'action');
  
  // Associer les permissions aux rôles
  const rolePermissions = [];
  
  // Admin a tout
  permissions.forEach(perm => {
    rolePermissions.push({
      id_role: roleIds.admin,
      id_permission: perm.id_permission
    });
  });
  
  // Comptable a comptabilité
  const comptablePerms = permissions.filter(p => p.module === 'comptabilite');
  comptablePerms.forEach(perm => {
    rolePermissions.push({
      id_role: roleIds.comptable,
      id_permission: perm.id_permission
    });
  });
  
  // Commercial a CRM et import-export
  const commercialPerms = permissions.filter(p => 
    p.module === 'crm' || p.module === 'import-export'
  );
  commercialPerms.forEach(perm => {
    rolePermissions.push({
      id_role: roleIds.commercial,
      id_permission: perm.id_permission
    });
  });

  await knex('role_permissions').insert(rolePermissions);
  
  console.log('✅ Seed utilisateurs terminé avec succès');
  console.log(`📊 ${roles.length} rôles créés`);
  console.log(`👥 3 utilisateurs créés`);
  console.log(`🔐 ${permissions.length} permissions créées`);
  console.log(`🔗 ${rolePermissions.length} associations rôle-permission créées`);
};