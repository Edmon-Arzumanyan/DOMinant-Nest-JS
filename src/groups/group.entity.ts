import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Profession } from 'src/professions/profession.entity';
import { GroupUser } from './group-user.entity';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/user.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 12 })
  min_age: number;

  @Column({ type: 'date' })
  duration_from: Date;

  @Column({ type: 'date' })
  duration_to: Date;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'json', default: {} })
  lessons: Record<string, any>;

  @OneToMany(() => GroupUser, (groupUser) => groupUser.group, { cascade: true })
  groupUsers: GroupUser[];

  @ManyToMany(() => Profession, (profession) => profession.groups)
  @JoinTable({
    name: 'group_professions',
    joinColumn: { name: 'group_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'profession_id', referencedColumnName: 'id' },
  })
  professions: Profession[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
