import { LoginAdminATResDTO } from './info';

export interface generateJWT {
  employee: LoginAdminATResDTO;
  isAccessToken: boolean;
  expires: number;
}
