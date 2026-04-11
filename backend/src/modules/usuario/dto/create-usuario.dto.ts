import { IsEmail, IsString, IsOptional, IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsEmail()
  correo: string;

  @IsString()
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
