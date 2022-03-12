import { environment } from '../environments/environment';

export const JWT_CONSTANT = {
  refresh: {
    secret: environment.JWT.REFRESH_SECRET,
    expiresIn: environment.JWT.REFRESH_EXPIRE,
  },
  access: {
    secret: environment.JWT.ACCESS_SECRET,
    expiresIn: environment.JWT.ACCESS_EXPIRE,
  },
};
