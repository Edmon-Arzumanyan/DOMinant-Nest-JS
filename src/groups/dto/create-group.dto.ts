import { IsString, IsNotEmpty, IsInt, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  min_age: number;

  @IsDateString()
  duration_from: string;

  @IsDateString()
  duration_to: string;

  @IsInt()
  price: number;

  @IsOptional()
  lessons?: Record<string, any>;

  @IsArray()
  @IsOptional()
  profession_ids?: number[];

  @IsArray()
  @IsOptional()
  user_ids?: number[];
}
