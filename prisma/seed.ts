import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as areas from './seed/area.json';
import * as locations from './seed/location.json';
import * as areaTypes from './seed/areaType.json';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const locationType = locations.map(async ({ id, ...rest }) => {
    await prisma.location.upsert({
      where: { id: id },
      update: rest,
      create: {
        id,
        ...rest,
      },
    });
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'Smith',
      roles: [UserRole.MANAGER, UserRole.ADMIN],
      password: bcrypt.hashSync(
        process.env.ADMIN_INITIAL_PASSWORD || uuid(),
        10
      ),
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      firstName: 'User',
      lastName: 'Smith',
      roles: [],
      password: bcrypt.hashSync(
        process.env.ADMIN_INITIAL_PASSWORD || uuid(),
        10
      ),
    },
  });

  const areaType = areaTypes.map(async ({ id, ...rest }) => {
    await prisma.areaType.upsert({
      where: { id: id },
      update: rest,
      create: {
        id,
        ...rest,
      },
    });
  });

  const area = areas.map(async ({ id, ...rest }) => {
    await prisma.area.upsert({
      where: { id: id },
      update: rest,
      create: {
        id,
        ...rest,
      },
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
