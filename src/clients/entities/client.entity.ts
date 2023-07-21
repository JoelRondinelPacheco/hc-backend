import { BaseEntity } from '../../config/base.entity';
import { ROLES } from '../../constants/roles';
import { IUser } from '../../interfaces/user.interface';
import { TicketEntity } from '../../sales/entities/ticket.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'clients' })
export class ClientEntity extends BaseEntity implements IUser {
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

  @OneToMany(() => TicketEntity, (ticket) => ticket.client)
  tickets: TicketEntity[];
}
