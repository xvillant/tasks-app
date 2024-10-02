import { Exclude, Expose } from 'class-transformer';
import { User } from './../../auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tasks' })
export class Task {
  constructor(partial: Partial<Task> = {}) {
    Object.assign(this, partial);
  }

  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column()
  title: string;

  @Expose()
  @Column()
  description: string;

  @Expose()
  @Column({ default: false })
  completed: boolean;

  @Expose()
  @Column({ name: 'completed_at', nullable: true, default: null })
  completedAt: Date;

  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Expose()
  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @Exclude()
  @Column()
  userId: number;
}
