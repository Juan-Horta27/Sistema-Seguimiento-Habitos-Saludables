import { IsString, IsOptional, IsInt, IsPositive, IsNumber } from 'class-validator';

export class CreateMetaDto {
  @IsInt()
  @IsPositive()
  habitoId: number;

  @IsNumber()
  @IsPositive()
  valorObjetivo: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
