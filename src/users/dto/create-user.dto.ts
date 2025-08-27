/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  IsEmail,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsDateString()
  date_of_birth: string;

  @IsInt()
  @IsOptional()
  role?: number = 1;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
