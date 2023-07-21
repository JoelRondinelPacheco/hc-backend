import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdminService } from 'src/admins/services/admin.service';
import { EmployeesService } from 'src/employees/services/employees.service';
import { ErrorManager } from 'src/utils/error.manager';
import { LoginEPDTO, LoginEPResDTO, LoginRFResDTO } from '../dto/login.dto';
import { AdminEntity } from 'src/admins/entities/admin.entity';
import { TokenService } from './token.service';
import { Request } from 'express';
import { EmployeeEntity } from 'src/employees/entities/employee.entity';
import { TokenInfo } from '../interfaces/token';
import { ROLES } from 'src/constants/roles';
import {
  InfoAdminPass,
  InfoEmployeePass,
  LoginEmployeeATResDTO,
} from '../interfaces/info';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly tokenService: TokenService,
    private readonly adminService: AdminService,
  ) {}

  public async login(body: LoginEPDTO): Promise<LoginEPResDTO> {
    try {
      const user = await this.validateEmployee(body);

      const accessToken = this.tokenService.generateAccessToken(user);
      if (!accessToken) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Token invalido',
        });
      }
      const refreshToken = this.tokenService.generateRefreshToken(user);
      if (!refreshToken) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Token invalido',
        });
      }

      const tokenDB = await this.tokenService.saveRefreshToken({
        ...refreshToken,
      });
      if (!tokenDB) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo crear el token',
        });
      }
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: user,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async validateEmployee(
    info: LoginEPDTO,
  ): Promise<LoginEmployeeATResDTO> {
    try {
      let userInfo: InfoEmployeePass;
      const admin: AdminEntity = await this.adminService.getAdminByEmail(
        info.email,
      );
      const employee: EmployeeEntity =
        await this.employeesService.getEmployeeByEmail(info.email);
      if (admin === null && employee === null) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Usuario no encontrado',
        });
      }
      if (admin) {
        userInfo = {
          id: admin.id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: admin.role,
          gameId: '',
          password: admin.password,
        };
      }

      if (employee) {
        userInfo = {
          id: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          role: employee.role,
          gameId: employee.game.id,
          password: employee.password,
        };
      }

      const match = await bcrypt.compare(info.password, userInfo.password);
      if (!match) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Usuario o contraseña incorrectos',
        });
      }

      const userfinal: LoginEmployeeATResDTO = {
        id: userInfo.id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        role: userInfo.role,
        email: userInfo.email,
        gameId: userInfo.gameId,
      };
      return userfinal;
    } catch (error) {
      throw error;
    }
  }

  public async setUserInfo(info: TokenInfo): Promise<LoginEmployeeATResDTO> {
    try {
      if (info.role === ROLES.ADMIN) {
        const admin = await this.adminService.getAdminByEmail(info.sub);
        const userfinal: LoginEmployeeATResDTO = {
          id: admin.id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
          email: admin.email,
          gameId: '',
        };
        return userfinal;
      }
      if (info.role === ROLES.EMPLOYEE) {
        return await this.employeesService.getEmployeeById(info.sub);
      }
    } catch (error) {
      throw error;
    }
  }

  //recibe el refrestoken, y vuelve a logearlo
  async loginWithRefreshToken(req: Request): Promise<LoginRFResDTO> {
    try {
      const refreshToken = req.header('token').split(' ')[1];

      const tokenInfo: TokenInfo = this.tokenService.tokenInfo(refreshToken);

      const userInfo = await this.setUserInfo(tokenInfo);
      const attoken = this.tokenService.generateAccessToken(userInfo);

      return { accessToken: attoken, user: userInfo };
    } catch (error) {
      if (error instanceof ErrorManager) {
        throw ErrorManager.createSignatureError(error.message);
      } else {
        throw error;
      }
    }
  }
}
