import { Module } from '@nestjs/common';
import { EmployeesService } from './services/employees.service';
import { EmployeesController } from './controllers/employees.controller';
import { EmployeeEntity } from './entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/games/entities/game.entity';
import { TokenService } from 'src/auth/services/token.service';
import { SaleService } from 'src/sales/services/sale.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity, GameEntity])],
  providers: [EmployeesService, TokenService, SaleService],
  controllers: [EmployeesController],
  exports: [EmployeesService, TypeOrmModule],
})
export class EmployeesModule {}
