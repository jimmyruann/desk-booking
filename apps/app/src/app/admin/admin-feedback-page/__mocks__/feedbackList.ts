export default [
  {
    id: 1,
    type: 'idea',
    title: 'This is test title',
    createAt: new Date(),
    updatedAt: new Date(),
    User: {
      id: 1,
      email: 'john.smith@example.com',
      firstName: 'John',
      lastName: 'Smith',
    },
  },
  {
    id: 2,
    type: 'issue',
    title: 'This is test title 2',
    createAt: new Date(),
    updatedAt: new Date(),
    User: {
      id: 2,
      email: 'Andrew.smith@example.com',
      firstName: 'Andrew',
      lastName: 'Smith',
    },
  },
];
