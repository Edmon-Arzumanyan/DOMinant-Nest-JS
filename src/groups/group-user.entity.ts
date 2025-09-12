import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { User } from 'src/users/user.entity';

@Entity('group_users')
export class GroupUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group, (group) => group.groupUsers, { onDelete: 'CASCADE' })
  group: Group;

  @ManyToOne(() => User, (user) => user.groupUsers, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'int', default: 2 })
  role: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
