import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../config/base.entity';
import { ROLES } from '../../constants/roles';
import { GameEntity } from '../../games/entities/game.entity';
import { IUser } from '../../interfaces/user.interface';
import { SaleEntity } from '../../sales/entities/sale.entity';
import { TicketEntity } from '../../sales/entities/ticket.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'employees' })
export class EmployeeEntity extends BaseEntity implements IUser {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  dni: number;

  @Column({ type: Date })
  birthday: Date;

  @Column({ type: 'enum', enum: ROLES })
  role: ROLES;

  @Column()
  @Exclude()
  password: string;

  @ManyToOne(() => GameEntity, (game) => game.id)
  game: GameEntity;

  @OneToMany(() => SaleEntity, (sale) => sale.employee)
  sales: SaleEntity[];

  @OneToMany(() => TicketEntity, (ticket) => ticket.employee)
  tickets: TicketEntity[];
}
