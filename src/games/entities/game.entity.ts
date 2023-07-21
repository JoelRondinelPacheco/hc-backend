import { BaseEntity } from '../../config/base.entity';
import { EmployeeEntity } from '../../employees/entities/employee.entity';
import { TicketEntity } from '../../sales/entities/ticket.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'games' })
export class GameEntity extends BaseEntity {
  @Column()
  name: string;
  @Column()
  price: number;
  @Column()
  schedule: string;
  @Column()
  capacidad: number;

  @OneToMany(() => EmployeeEntity, (employee) => employee.game)
  employees: EmployeeEntity[];

  @OneToMany(() => TicketEntity, (ticket) => ticket.game)
  tickets: TicketEntity[];
}
