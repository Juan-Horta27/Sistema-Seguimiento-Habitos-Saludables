import { IsString, IsOptional, IsInt, IsPositive, IsNumber } from 'class-validator';

export class CreateMetaDto {
  @IsInt()
  @IsPositive()
  habitoId: number;

  @IsString()
  descripcion: string;

  @IsNumber()
  @IsPositive()
  valorMeta: number;
}
