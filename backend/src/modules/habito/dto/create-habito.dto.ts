import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';

export class CreateHabitoDto {
  @IsInt()
  @IsPositive()
  usuarioId: number;

  @IsInt()
  @IsPositive()
  categoriaHabitoId: number;

  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  unidadMedida: string;

  @IsOptional()
  @IsString()
  frecuencia?: string;
}
