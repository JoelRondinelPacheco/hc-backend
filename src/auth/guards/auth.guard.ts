import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AdminService } from 'src/admins/services/admin.service';
import { ROLES_KEY } from 'src/constants/key-decorators';
import { ROLESAUTH } from 'src/constants/roles';
import { EmployeesService } from 'src/employees/services/employees.service';
import { SaleService } from 'src/sales/services/sale.service';
import { TokenInfo } from '../interfaces/token';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly adminService: AdminService,
    private readonly employeeService: EmployeesService,
    private readonly saleService: SaleService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest<Request>();
      const headerToken = req.header('token');
      if (!headerToken || Array.isArray(headerToken)) {
        throw new UnauthorizedException('Invalid token');
      }
      const tokenBearer = headerToken.split(' ')[0];
      if (tokenBearer !== 'Bearer') {
        throw new UnauthorizedException('Invalid token');
      }
      const token = headerToken.split(' ')[1];
      const verifyAT = this.tokenService.verifyAccessToken(token);
      if (typeof verifyAT === 'string') {
        if (verifyAT === 'jwt expired') {
          throw new UnauthorizedException('Token expired');
        }
      }

      const userAccess = this.reflector.get<ROLESAUTH>(
        ROLES_KEY,
        context.getHandler(),
      );

      if ((verifyAT as TokenInfo).role === ROLESAUTH.ADMIN) {
        const admin = await this.adminService.getAdminById(
          (verifyAT as TokenInfo).sub,
        );
        if (admin) {
          if (
            userAccess !== ROLESAUTH.SALEEMPLOYEE &&
            userAccess !== ROLESAUTH.TICKETEMPLOYEE &&
            userAccess !== ROLESAUTH.SALEOWNER
          ) {
            return true;
          }
        }
      }

      if ((verifyAT as TokenInfo).role === ROLESAUTH.EMPLOYEE) {
        const employee = await this.employeeService.getEmployeeById(
          (verifyAT as TokenInfo).sub,
        );
        if (employee) {
          if (userAccess === ROLESAUTH.EMPLOYEE) return true;

          if (userAccess === ROLESAUTH.TICKETEMPLOYEE) return true;
          if (userAccess === ROLESAUTH.SALEEMPLOYEE) return true;
          if (userAccess === ROLESAUTH.ONEEMPLOYEE) {
            // VERIFICAR QUE EL ID POR PARAM, ES EL MISMO QUE EL ID POR TOKEN

            if (req.params.idEmployee === verifyAT.sub) return true;
          }
          if (userAccess === ROLESAUTH.SALEOWNER) {
            const saleId = req.params.saleId;
            const sale = await this.saleService.getSaleById(saleId);
            if ((verifyAT as TokenInfo).sub === sale.employee.id) return true;
            // BUSCAR LA VENTA EN LA BD
            // VERIFICAR QUE EL ID DEL EMPLEADO EN LA VENTA, COINICIDA CON EL QUE ESTA EN LA VENTA
          }
          if (userAccess === ROLESAUTH.GAMEOWNER) {
            const gameId = req.params.gameId;
            const employee = await this.employeeService.getEmployeeById(
              (verifyAT as TokenInfo).sub,
            );
            if (employee.gameId === gameId) return true;
            // BUSACR EL EL EMPLOYEE, Y VER SU JUEGO
            // VERIFICAR QUEL EL ID DEL JUEGO, ES EL MISMO QUEENVIA EL EMPLEADO
          }
        } else {
          throw new UnauthorizedException('No tienes los permisos necesarios');
        }
      }

      return false;
    } catch (error) {
      throw error;
    }
  }
}
