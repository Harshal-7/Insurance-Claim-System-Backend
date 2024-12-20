import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Policy } from '../policies/policies.entity';

@Entity('claims')
export class Claim {
  @PrimaryGeneratedColumn()
  claim_id: number;

  @ManyToOne(() => Policy, (policy) => policy.policy_id, {
    onDelete: 'CASCADE',
  })
  policy: Policy;

  @ManyToOne(() => User, (user) => user.user_id, { onDelete: 'CASCADE' })
  user: User;

  @Column({ length: 100 })
  claim_type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount_requested: number;

  @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'] })
  status: 'pending' | 'approved' | 'rejected';

  @CreateDateColumn()
  submission_date: Date;

  @Column('json', { nullable: true })
  documents: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
