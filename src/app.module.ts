import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsModule } from './admins/admins.module';
import { DataSourceConfig } from './config/data.source';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { EmployeesModule } from './employees/employees.module';
import { GamesModule } from './games/games.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),
    AdminsModule,
    EmployeesModule,
    GamesModule,
    SalesModule,
    ClientsModule,
    AuthModule,
  ],
})
export class AppModule {}
