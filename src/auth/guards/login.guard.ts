import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { LOGIN_KEY } from 'src/constants/key-decorators';
import { LOGINLEVEL } from 'src/constants/login-level';
import { TokenService } from '../services/token.service';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const loginLevel = this.reflector.get<LOGINLEVEL>(
        LOGIN_KEY,
        context.getHandler(),
      );

      if (loginLevel === LOGINLEVEL.NEW) return true;

      const req = context.switchToHttp().getRequest<Request>();
      const headerToken = req.header('token');
      if (!headerToken || Array.isArray(headerToken)) {
        throw new UnauthorizedException('Invalid token');
      }
      const tokenBearer = headerToken.split(' ')[0];
      if (tokenBearer !== 'Bearer') {
        throw new UnauthorizedException('Invalid token login');
      }
      const token = headerToken.split(' ')[1];
      /*
      if (loginLevel === LOGINLEVEL.ACCESS_TOKEN) {
        const verifyAT = this.tokenService.verifyAccessToken(token);
        if (typeof verifyAT === 'string') {
          if (verifyAT === 'jwt expired') {
            throw new UnauthorizedException('Token expired');
          }
        }
        return true;
      }
*/
      if (loginLevel === LOGINLEVEL.REFRESH_TOKEN) {
        const tokenDB = await this.tokenService.getTokenDB(token);

        const verifyTokenDB = this.tokenService.verifyRefreshToken(
          tokenDB.token,
        );
        if (typeof verifyTokenDB === 'string') {
          if (verifyTokenDB === 'jwt expired')
            try {
              await this.tokenService.deleteToken(tokenDB.id);
            } catch (error) {
              throw new ErrorManager({
                type: 'INTERNAL_SERVER_ERROR',
                message: 'Error al intentar eliminar el token',
              });
            }
          throw new ErrorManager({
            type: 'UNAUTHORIZED',
            message: 'Token expired',
          });
        }
        return true;
      }
    } catch (error) {
      throw error;
    }
  }
}
