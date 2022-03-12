const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const areas = require('./seed/area.json');
const locations = require('./seed/location.json');
const areaTypes = require('./seed/areaType.json');

const prisma = new PrismaClient();

async function main() {
  await new Promise((resolve) => {
    const promises = [];

    for (let i = 0; i < locations.length; i++) {
      const { id, ...rest } = locations[i];
      promises.push(
        prisma.location.upsert({
          where: { id },
          update: rest,
          create: {
            id,
            ...rest,
          },
        })
      );
    }

    resolve(Promise.all(promises));
  })
    .then(() => {
      const promises = [];
      for (let i = 0; i < areaTypes.length; i++) {
        const { id, ...rest } = areaTypes[i];
        promises.push(
          prisma.areaType.upsert({
            where: { id },
            update: rest,
            create: {
              id,
              ...rest,
            },
          })
        );
      }
      return Promise.all(promises);
    })
    .then(() => {
      const promises = [];
      for (let i = 0; i < areas.length; i++) {
        const { id, ...rest } = areas[i];
        promises.push(
          prisma.area.upsert({
            where: { id },
            update: rest,
            create: {
              id,
              ...rest,
            },
          })
        );
      }
      return Promise.all(promises);
    })
    .then(() => {
      // Please change the password asap
      if (!process.env.ADMIN_INITIAL_PASSWORD) {
        throw new Error('process.env.ADMIN_INITIAL_PASSWORD is missing');
      }

      return prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'Smith',
          roles: [UserRole.MANAGER, UserRole.ADMIN],
          password: bcrypt.hashSync(process.env.ADMIN_INITIAL_PASSWORD, 10),
        },
      });
    })
    .then((data) => {
      console.log('Done');
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
