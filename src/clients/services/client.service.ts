import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from '../entities/client.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ClientDTO, UpdateClientDTO } from '../dto/client.dto';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepositry: Repository<ClientEntity>,
  ) {}
  public async createClient(body: ClientDTO): Promise<ClientEntity> {
    try {
      const client = await this.clientRepositry.save(body);
      if (!client) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo crear el cliente',
        });
      }
      return client;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getClientById(id: string): Promise<ClientEntity> {
    try {
      //VERIFICAR QUE ID SEA UUD
      const client: ClientEntity = await this.clientRepositry
        .createQueryBuilder('client')
        .where({ id })
        .getOne();
      if (!client) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No se encontro el cliente',
        });
      }
      return client;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getAllClients(): Promise<ClientEntity[]> {
    try {
      const clients: ClientEntity[] = await this.clientRepositry.find();
      if (clients.length === 0) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No se encontraron resultados',
        });
      }
      return clients;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateClient(
    id: string,
    body: UpdateClientDTO,
  ): Promise<UpdateResult | undefined> {
    try {
      //VERIFICAR QUE SEA UUID, SI NO LES ES BAD_REQUEST
      // VERIFICAR QUE EXISTA
      // SI NO EXISTE NOT FOUND
      const client: UpdateResult = await this.clientRepositry.update(id, body);
      if (!client) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se puedo actualizar',
        });
      }
      return client;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteClient(id: string): Promise<DeleteResult | undefined> {
    try {
      //VERIFICAR QUE SEA UUID, SI NO LES ES BAD_REQUEST
      // VERIFICAR QUE EXISTA
      // SI NO EXISTE NOT FOUND
      const client: DeleteResult = await this.clientRepositry.delete(id);
      if (client.affected === 0) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudo borrar',
        });
      }
      return client;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
