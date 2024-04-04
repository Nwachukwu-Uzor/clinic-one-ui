export type TokenType = {
  Id: string;
  sub: string;
  email: string;
  jti: string;
  role: string | string[];
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
};
