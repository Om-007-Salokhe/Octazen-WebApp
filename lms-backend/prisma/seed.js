// Seed script to initialize the first admin user
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || 'Admin';
  const rawPassword = process.env.ADMIN_PASSWORD || 'Admin1234';
  const email = process.env.FIRST_ADMIN_EMAIL || 'admin@institution.edu';
  const fullName = username;

  console.log(`[Seed] Checking for existing admin with email: ${email} or username: ${username}...`);

  const existingAdmin = await prisma.admin.findFirst({
    where: {
      OR: [{ email }, { fullName: username }],
    },
  });

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(rawPassword, salt);

  if (existingAdmin) {
    console.log(`[Seed] Updating credentials for admin: ${existingAdmin.email} (ID: ${existingAdmin.id})`);
    await prisma.admin.update({
      where: { id: existingAdmin.id },
      data: {
        passwordHash,
        fullName: username,
      },
    });
    console.log(`[Seed] Admin credentials updated successfully.`);
    return;
  }

  const admin = await prisma.admin.create({
    data: {
      email,
      passwordHash,
      fullName,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log(`[Seed] Successfully created first Super Admin:`);
  console.log(` - ID: ${admin.id}`);
  console.log(` - Username: ${admin.fullName}`);
  console.log(` - Email: ${admin.email}`);
  console.log(` - Role: ${admin.role}`);
}

main()
  .catch((e) => {
    console.error('[Seed Error]:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
