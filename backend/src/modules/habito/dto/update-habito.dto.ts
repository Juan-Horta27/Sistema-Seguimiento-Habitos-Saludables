import { IsString, IsOptional, IsInt, IsPositive } from 'class-validator';

export class UpdateHabitoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  categoriaHabitoId?: number;
}
