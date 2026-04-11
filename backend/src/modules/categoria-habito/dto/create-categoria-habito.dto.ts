import { IsString, IsOptional } from 'class-validator';

export class CreateCategoriaHabitoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
