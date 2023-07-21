import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from '../entities/admin.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { AdminDTO, AdminUpdateDTO } from '../dto/admin.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { InfoAdminPass, LoginAdminATResDTO } from 'src/auth/interfaces/info';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly configService: ConfigService,
  ) {}
  public async createAdmin(body: AdminDTO): Promise<AdminEntity> {
    try {
      const passwordHash = await bcrypt.hash(body.password, 10);
      console.log(passwordHash);
      if (!passwordHash) {
        console.log(passwordHash);
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo hashsear la contraseña',
        });
      }
      console.log(new Date(body.birthday));
      const admin = await this.adminRepository.save({
        ...body,
        password: passwordHash,
      });

      if (!admin) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo crear el administrador',
        });
      }
      return admin;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getAllAdmins(): Promise<AdminEntity[]> {
    try {
      const admins: AdminEntity[] = await this.adminRepository.find();
      if (admins.length === 0) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No se encontro resultados',
        });
      }
      return admins;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getAdminById(id: string): Promise<LoginAdminATResDTO> {
    try {
      //VERIFICAR QUE ID SEA UUD
      const admin: AdminEntity = await this.adminRepository
        .createQueryBuilder('admin')
        .where({ id })
        .getOne();

      if (!admin) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No se encontro al administrador',
        });
      }
      const { password, ...adminRes } = admin;
      return adminRes;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async adminFullInfo(id: string): Promise<InfoAdminPass> {
    try {
      const admin: AdminEntity = await this.adminRepository
        .createQueryBuilder('admin')
        .where({ id })
        .getOne();

      if (!admin) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No se encontro al administrador',
        });
      }
      return admin;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getAdminByEmail(email: string): Promise<AdminEntity> | null {
    try {
      const admin = await this.adminRepository
        .createQueryBuilder('admin')
        .where({ email })
        .getOne();
      if (!admin) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Usuario no encontrado',
        });
      }
      return admin;
    } catch (error) {
      return null;
    }
  }
  public async updateAdmin(
    id: string,
    body: AdminUpdateDTO,
  ): Promise<UpdateResult | undefined> {
    try {
      //VERIFICAR QUE SEA UUID, SI NO LES ES BAD_REQUEST
      // VERIFICAR QUE EXISTA
      // SI NO EXISTE NOT FOUND
      const admin: UpdateResult = await this.adminRepository.update(id, body);
      if (admin.affected === 0) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se puedo actualizar',
        });
      }
      return admin;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteAdmin(id: string): Promise<DeleteResult | undefined> {
    try {
      //VERIFICAR QUE SEA UUID, SI NO LES ES BAD_REQUEST
      // VERIFICAR QUE EXISTA
      // SI NO EXISTE NOT FOUND
      const admin: DeleteResult = await this.adminRepository.delete(id);
      if (admin.affected === 0) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se puedo borrar',
        });
      }
      return admin;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
