import { IsEmail, IsString, IsOptional, IsInt, IsNumber, Min, Max } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;

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
