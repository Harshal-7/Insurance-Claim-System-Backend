import { Claim } from 'src/claims/claims.entity';
import { User } from 'src/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('policies')
export class Policy {
  @PrimaryGeneratedColumn()
  policy_id: number;

  @ManyToOne(() => User, (user) => user.policies)
  user: User;

  @Column()
  policy_type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  premium: number;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @OneToMany(() => Claim, (claim) => claim.policy)
  claims: Claim[];
}
