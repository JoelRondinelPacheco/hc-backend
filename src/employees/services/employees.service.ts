import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from '../entities/employee.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { EmployeeDTO } from '../dto/employee.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { UpdateClientDTO } from 'src/clients/dto/client.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {
  EmployeeInfo,
  InfoEmployeePass,
  LoginEmployeeATResDTO,
} from 'src/auth/interfaces/info';
import { classToPlain } from 'class-transformer';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
    private readonly configService: ConfigService,
  ) {}

  public async createEmployee(body: EmployeeDTO): Promise<EmployeeEntity> {
    try {
      const passwordHash = await bcrypt.hash(
        body.password,
        +this.configService.get('HASH_SALT'),
      );
      if (!passwordHash) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo hashsear la contraseña',
        });
      }

      const employee = await this.employeeRepository.save({
        ...body,
        password: passwordHash,
      });
      if (!employee) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se puedo crear el empleado',
        });
      }
      return employee;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getEmployeeById(id: string): Promise<EmployeeInfo> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { id: id },
        relations: ['game'],
      });
      if (!employee) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Empleado no asdsecontrado',
        });
      }

      return {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        role: employee.role,
        game: employee.game,
        gameId: employee.game.id,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async employeeFullInfo(id: string): Promise<InfoEmployeePass> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { id: id },
        relations: ['game'],
      });

      if (!employee) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No se encontro al empleado',
        });
      }
      return { ...employee, gameId: employee.game.id };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getEmployeeByEmail(
    email: string,
  ): Promise<EmployeeEntity> | null {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { email: email },
        relations: ['game'],
      });
      if (!employee) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Usuario no encontrado',
        });
      }
      return employee;
    } catch (error) {
      return null;
    }
  }

  public async getAllEmployees(): Promise<EmployeeEntity[]> {
    try {
      const employees: EmployeeEntity[] = await this.employeeRepository.find({
        relations: ['game'],
      });
      if (employees.length === 0) {
        console.log('sin empleados');
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No se encontraron empleados',
        });
      }
      return employees;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateEmployee(
    id: string,
    body: UpdateClientDTO,
  ): Promise<UpdateResult | undefined> {
    try {
      //VERIFICAR QUE SEA UUID, SI NO LES ES BAD_REQUEST
      // VERIFICAR QUE EXISTA
      // SI NO EXISTE NOT FOUND
      const employee: UpdateResult = await this.employeeRepository.update(
        id,
        body,
      );
      if (employee.affected === 0) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo editar el empleado',
        });
      }
      return employee;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteEmloyee(id: string): Promise<DeleteResult | undefined> {
    try {
      //VERIFICAR QUE SEA UUID, SI NO LES ES BAD_REQUEST
      // VERIFICAR QUE EXISTA
      // SI NO EXISTE NOT FOUND
      const employee = await this.employeeRepository.delete(id);
      if (employee.affected === 0) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo eliminar el empleado',
        });
      }
      return employee;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
