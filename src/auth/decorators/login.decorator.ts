import { SetMetadata } from '@nestjs/common';
import { LOGIN_KEY } from 'src/constants/key-decorators';
import { LOGINLEVEL } from 'src/constants/login-level';

export const Login = () => SetMetadata(LOGIN_KEY, LOGINLEVEL.NEW);
