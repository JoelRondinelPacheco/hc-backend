import { BaseEntity } from '../../config/base.entity';
import { EmployeeEntity } from '../../employees/entities/employee.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { TicketEntity } from './ticket.entity';

@Entity({ name: 'sales' })
export class SaleEntity extends BaseEntity {
  @Column({ default: false })
  isCompleted: boolean;

  @OneToMany(() => TicketEntity, (ticket) => ticket.sale)
  tickets: TicketEntity[];

  @ManyToOne(() => EmployeeEntity, (employee) => employee.id)
  employee: EmployeeEntity;
}
