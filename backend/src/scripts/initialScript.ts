import { prisma } from "../lib/prisma";
import * as bcrypt from 'bcrypt';

async function createSuperAdmin() {
  try {
    console.log('🚀 Starting Super Admin setup...\n');

    // 1. Create SuperAdmin Role
    console.log('📝 Creating SuperAdmin role...');
    const superAdminRole = await prisma.role.upsert({
      where: { name: 'SuperAdmin' },
      update: {},
      create: {
        name: 'SuperAdmin',
        description: 'Super Administrator with full system access',
        createdBy: 'system',
      },
    });
    console.log(`✅ SuperAdmin role created: ${superAdminRole.id}\n`);

    // 2. Create Permissions
    console.log('📝 Creating permissions...');
    const permissions = [
      { name: 'user.create', description: 'Create users' },
      { name: 'user.read', description: 'View users' },
      { name: 'user.update', description: 'Update users' },
      { name: 'user.delete', description: 'Delete users' },
      { name: 'role.create', description: 'Create roles' },
      { name: 'role.read', description: 'View roles' },
      { name: 'role.update', description: 'Update roles' },
      { name: 'role.delete', description: 'Delete roles' },
      { name: 'permission.create', description: 'Create permissions' },
      { name: 'permission.read', description: 'View permissions' },
      { name: 'permission.update', description: 'Update permissions' },
      { name: 'permission.delete', description: 'Delete permissions' },
      { name: 'system.configure', description: 'Configure system settings' },
    ];

    const createdPermissions = [];
    for (const permission of permissions) {
      const created = await prisma.permission.upsert({
        where: { name: permission.name },
        update: {},
        create: {
          name: permission.name,
          description: permission.description,
          createdBy: 'system',
        },
      });
      createdPermissions.push(created);
      console.log(`  ✓ ${permission.name}`);
    }
    console.log(`✅ Created ${createdPermissions.length} permissions\n`);

    // 3. Assign all permissions to SuperAdmin role
    console.log('📝 Assigning permissions to SuperAdmin role...');
    for (const permission of createdPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: superAdminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
          createdBy: 'system',
        },
      });
    }
    console.log(`✅ Assigned all ${createdPermissions.length} permissions to SuperAdmin\n`);

    // 4. Create Super Admin User
    console.log('📝 Creating super admin user...');
    const hashedPassword = await bcrypt.hash('adminPassword', 10);

    const adminUser = await prisma.user.upsert({
      where: { userName: 'admin@admin.com' },
      update: {
        passwordHash: hashedPassword, // Update password if user exists
      },
      create: {
        userName: 'admin@admin.com',
        name: 'Super Administrator',
        passwordHash: hashedPassword,
        createdBy: 'system',
      },
    });
    console.log(`✅ Super admin user: ${adminUser.userName}\n`);

    // 5. Assign SuperAdmin role to user
    console.log('📝 Assigning SuperAdmin role to user...');
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: superAdminRole.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
        createdBy: 'system',
      },
    });
    console.log(`✅ SuperAdmin role assigned to user\n`);

    console.log('🎉 Super Admin setup completed successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('📋 SUPER ADMIN CREDENTIALS:');
    console.log('═══════════════════════════════════════');
    console.log('Username: admin@admin.com');
    console.log('Password: adminPassword');
    console.log('Role:     SuperAdmin');
    console.log(`Permissions: ${createdPermissions.length} (Full Access)`);
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error creating super admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createSuperAdmin()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
