export const cleanJWT = (token) => {
  if (typeof token === 'string') {
    return token;
  }
  const cleanToken = { ...token };
  delete cleanToken.iss;
  delete cleanToken.sub;
  delete cleanToken.aud;
  delete cleanToken.exp;
  delete cleanToken.nbf;
  delete cleanToken.iat;
  delete cleanToken.jti;
  return cleanToken;
};
