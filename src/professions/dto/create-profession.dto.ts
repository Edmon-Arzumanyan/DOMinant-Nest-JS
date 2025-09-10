import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfessionDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  stack?: any;

  @IsOptional()
  logoImageUrl?: string;
}
