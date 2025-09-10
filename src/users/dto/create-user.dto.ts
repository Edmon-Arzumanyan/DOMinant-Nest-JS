import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  dateOfBirth: string;

  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(UserRole)
  role: UserRole = UserRole.User;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
