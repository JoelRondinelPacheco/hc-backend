import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateTicketsDTO } from '../dto/ticket.dto';
import { TicketService } from '../services/ticket.service';
import { RolesAccess } from 'src/auth/decorators/roleaccess.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @RolesAccess('TICKETEMPLOYEE')
  @Post('agregar')
  public async createTickets(@Body() body: CreateTicketsDTO) {
    return await this.ticketService.createTickets(body);
  }

  @RolesAccess('ADMIN')
  @Get('all')
  public async getAllTickets() {
    return await this.ticketService.getAllTickets();
  }
}
