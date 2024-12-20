import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity('policies')
export class Policy {
  @PrimaryGeneratedColumn()
  policy_id: number;

  @ManyToOne(() => User, (user) => user.user_id, { onDelete: 'CASCADE' })
  user: User;

  @Column({ length: 100 })
  policy_type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  premium: number;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({ type: 'enum', enum: ['active', 'expired', 'canceled'] })
  status: 'active' | 'expired' | 'canceled';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
