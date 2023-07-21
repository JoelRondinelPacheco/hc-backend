import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'src/constants/key-decorators';
import { ROLESAUTH } from 'src/constants/roles';

export const RolesAccess = (...roles: Array<keyof typeof ROLESAUTH>) =>
  SetMetadata(ROLES_KEY, roles);
