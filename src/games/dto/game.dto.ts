import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GameDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsString()
  schedule: string;
  @IsNotEmpty()
  @IsNumber()
  capacidad: number;
}

export class UpdateGameDTO {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsNumber()
  price: number;
  @IsOptional()
  @IsString()
  schedule: string;
  @IsOptional()
  @IsNumber()
  capacidad: number;
}
