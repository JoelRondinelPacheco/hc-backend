import { SetMetadata } from '@nestjs/common';
import { LOGIN_KEY } from 'src/constants/key-decorators';
import { LOGINLEVEL } from 'src/constants/login-level';

export const LoginRefresh = () =>
  SetMetadata(LOGIN_KEY, LOGINLEVEL.REFRESH_TOKEN);
