import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TicketEntity } from '../entities/ticket.entity';
import { CreateTicketsDTO } from '../dto/ticket.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
  ) {}

  public async createTickets(body: CreateTicketsDTO) {
    try {
      const tickets = await this.ticketRepository
        .createQueryBuilder()
        .insert()
        .values(body.tickets)
        .execute();
      if (tickets.generatedMaps.length !== body.tickets.length) {
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'No se pudieron cargar todos los tickets',
        });
      }
      // return;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getAllTickets(): Promise<TicketEntity[]> {
    try {
      const tickets = await this.ticketRepository.find();
      if (tickets.length === 0) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'No se encontro resultados',
        });
      }
      return tickets;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
