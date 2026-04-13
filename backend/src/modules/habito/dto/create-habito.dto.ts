import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';

export class CreateHabitoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsInt()
  @IsPositive()
  categoriaHabitoId: number;

  @IsInt()
  @IsPositive()
  usuarioId: number;
}
