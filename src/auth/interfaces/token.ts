import { ROLES } from 'src/constants/roles';

export interface PayloadToken {
  sub: string;
  role: ROLES;
}

export interface TokenI {
  token: string;
}

export interface TokenInfo {
  role: string;
  sub: string;
}
export interface DecodedTokenInfo extends TokenInfo {
  iat: number;
  exp: number;
}
