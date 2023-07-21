import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AdminsModule } from 'src/admins/admins.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { GamesModule } from 'src/games/games.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admins/entities/admin.entity';
import { EmployeeEntity } from 'src/employees/entities/employee.entity';
import { GameEntity } from 'src/games/entities/game.entity';
import { TokenService } from './services/token.service';
import { Token } from './entities/token.entity';
import { SalesModule } from 'src/sales/sales.module';
import { SaleEntity } from 'src/sales/entities/sale.entity';
import { TicketEntity } from 'src/sales/entities/ticket.entity';
import { AdminService } from 'src/admins/services/admin.service';
import { SaleService } from 'src/sales/services/sale.service';
import { EmployeesService } from 'src/employees/services/employees.service';
import { GameService } from 'src/games/services/game.service';
@Module({
  imports: [
    AdminsModule,
    SalesModule,
    EmployeesModule,
    GamesModule,
    TypeOrmModule.forFeature([
      AdminEntity,
      EmployeeEntity,
      GameEntity,
      Token,
      SaleEntity,
      TicketEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
})
export class AuthModule {}
