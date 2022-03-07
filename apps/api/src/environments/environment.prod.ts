export const environment = {
  production: true,
  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    ACCESS_EXPIRE: '5m',
    REFRESH_NAME: process.env.REFRESH_NAME || 'jid',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    REFRESH_EXPIRE: '3d',
  },
};
