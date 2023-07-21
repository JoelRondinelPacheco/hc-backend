import { BaseEntity } from '../../config/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'tokens' })
export class Token extends BaseEntity {
  @Column()
  token: string;
}
