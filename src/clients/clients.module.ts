import { Module } from '@nestjs/common';
import { ClientController } from './controllers/client.controller';
import { ClientService } from './services/client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { TokenService } from 'src/auth/services/token.service';
import { EmployeesService } from 'src/employees/services/employees.service';
import { SaleService } from 'src/sales/services/sale.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  controllers: [ClientController],
  providers: [ClientService, TokenService, EmployeesService, SaleService],
})
export class ClientsModule {}
