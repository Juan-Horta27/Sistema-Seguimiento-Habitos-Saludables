import { IsString, IsOptional, IsInt, IsPositive, IsBoolean } from 'class-validator';

export class UpdateHabitoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  unidadMedida?: string;

  @IsOptional()
  @IsString()
  frecuencia?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  categoriaHabitoId?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
