import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { Group } from '../groups/group.entity';

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

  //   // Assuming relation to groups
  //   @OneToMany(() => Group, (group) => group.profession)
  //   groups: Group[];

  @Column({ nullable: true })
  logoImageUrl: string;
}
