import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Group } from '../groups/group.entity';

@Entity()
export class Profession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', default: {} })
  stack: any;

  @ManyToMany(() => Group, (group) => group.professions)
  groups: Group[];

  @Column({ nullable: true })
  logoImageUrl: string;
}
