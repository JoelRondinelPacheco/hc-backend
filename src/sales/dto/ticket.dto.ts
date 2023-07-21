import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ClientDTO } from 'src/clients/dto/client.dto';
import { EmployeeDTO } from 'src/employees/dto/employee.dto';
import { GameDTO } from 'src/games/dto/game.dto';
import { SaleEntity } from '../entities/sale.entity';

export class TicketDTO {
  @IsNotEmpty()
  @IsString()
  hora: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  employee: EmployeeDTO;

  @IsNotEmpty()
  game: GameDTO;

  @IsNotEmpty()
  client: ClientDTO;

  @IsNotEmpty()
  sale: SaleEntity;
}

export class CreateTicketsDTO {
  tickets: TicketDTO[];
}
