import { Global, Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { TokenService } from 'src/auth/services/token.service';
import { Token } from 'src/auth/entities/token.entity';
import { EmployeesService } from 'src/employees/services/employees.service';
import { EmployeeEntity } from 'src/employees/entities/employee.entity';
import { SaleService } from 'src/sales/services/sale.service';
import { SaleEntity } from 'src/sales/entities/sale.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity, Token, EmployeeEntity, SaleEntity]),
  ],
  controllers: [AdminController],
  providers: [AdminService, TokenService, EmployeesService, SaleService],
  exports: [AdminService, TypeOrmModule],
})
export class AdminsModule {}
