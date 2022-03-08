import { User, UserRole } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const generateUser = (): [User, string] => {
  const realPassword = faker.internet.password();
  return [
    {
      id: faker.datatype.number(),
      email: faker.internet.email(),
      password: bcrypt.hashSync(realPassword, 10),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      roles: [],
    },
    realPassword,
  ];
};

export const testDataHelper = {
  generateUser,
};
