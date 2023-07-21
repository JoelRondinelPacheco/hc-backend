import { Module } from '@nestjs/common';
import { GameController } from './controllers/game.controller';
import { GameService } from './services/game.service';
import { GameEntity } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from 'src/auth/services/token.service';
import { EmployeesService } from 'src/employees/services/employees.service';
import { SaleService } from 'src/sales/services/sale.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity])],
  controllers: [GameController],
  providers: [GameService, TokenService, EmployeesService, SaleService],
  exports: [GameService, TypeOrmModule],
})
export class GamesModule {}
