import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoriaHabitoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
