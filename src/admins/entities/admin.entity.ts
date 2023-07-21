import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../config/base.entity';
import { ROLES } from '../../constants/roles';
import { IUser } from '../../interfaces/user.interface';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'admins' })
export class AdminEntity extends BaseEntity implements IUser {
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
}
