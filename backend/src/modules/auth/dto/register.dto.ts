import { IsEmail, IsString, MinLength, IsInt, IsOptional, Min, Max, IsNumber } from 'class-validator';

export class RegisterDto {
  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(6)
  contrasena: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  edad?: number;

  @IsOptional()
  @IsNumber()
  peso?: number;

  @IsOptional()
  @IsNumber()
  estatura?: number;
}
