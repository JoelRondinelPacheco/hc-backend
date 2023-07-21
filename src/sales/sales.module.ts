import { Module } from '@nestjs/common';
import { SaleController } from './controllers/sale.controller';
import { SaleService } from './services/sale.service';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleEntity } from './entities/sale.entity';
import { TicketEntity } from './entities/ticket.entity';
import { TokenService } from 'src/auth/services/token.service';
import { EmployeesService } from 'src/employees/services/employees.service';

@Module({
  imports: [TypeOrmModule.forFeature([SaleEntity, TicketEntity])],
  controllers: [SaleController, TicketController],
  providers: [SaleService, TicketService, TokenService, EmployeesService],
  exports: [SaleService, TypeOrmModule],
})
export class SalesModule {}
