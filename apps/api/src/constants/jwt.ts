import { JwtSignOptions } from '@nestjs/jwt';

interface IJWT_CONSTANT {
  refresh: JwtSignOptions;
  access: JwtSignOptions;
}

export const JWT_CONSTANT: IJWT_CONSTANT = {
  refresh: {
    secret: 'efgh',
    expiresIn: '7d',
  },
  access: {
    secret: 'abcd',
    expiresIn: '1d',
  },
};
