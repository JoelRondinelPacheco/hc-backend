import { BaseEntity } from '../../config/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { SaleEntity } from './sale.entity';
import { ClientEntity } from '../../clients/entities/client.entity';
import { GameEntity } from '../../games/entities/game.entity';
import { EmployeeEntity } from '../../employees/entities/employee.entity';

@Entity({ name: 'tickets' })
export class TicketEntity extends BaseEntity {
  @Column({ type: 'time' })
  hora: string;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.id)
  employee: EmployeeEntity;

  @ManyToOne(() => GameEntity, (game) => game.id)
  game: GameEntity;

  @ManyToOne(() => ClientEntity, (client) => client.id)
  client: ClientEntity;

  @ManyToOne(() => SaleEntity, (sale) => sale.id)
  sale: SaleEntity;
}
