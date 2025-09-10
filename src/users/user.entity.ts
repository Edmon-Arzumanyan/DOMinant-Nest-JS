import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

export enum UserRole {
  SuperAdmin = 0,
  Teacher = 1,
  User = 2,
}

@Entity({ name: 'users' })
@Index('index_users_on_email', ['email'], { unique: true })
@Index('index_users_on_reset_password_token', ['resetPasswordToken'], {
  unique: true,
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', type: 'varchar', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', nullable: false })
  lastName: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: false })
  dateOfBirth: Date;

  @Column({
    type: 'int',
    default: UserRole.User,
    nullable: false,
  })
  role: UserRole;

  @Column({ type: 'varchar', nullable: false })
  phone: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'varchar',
    default: '',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    name: 'encrypted_password',
    type: 'varchar',
    default: '',
    nullable: false,
  })
  encryptedPassword: string;

  @Column({
    name: 'reset_password_token',
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  resetPasswordToken?: string;

  @Column({
    name: 'reset_password_sent_at',
    type: 'timestamp',
    nullable: true,
  })
  resetPasswordSentAt?: Date;

  @Column({
    name: 'remember_created_at',
    type: 'timestamp',
    nullable: true,
  })
  rememberCreatedAt?: Date;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updatedAt: Date;
}
