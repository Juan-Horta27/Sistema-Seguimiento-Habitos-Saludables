import { IsString, IsOptional, IsNumber, IsPositive, IsBoolean } from 'class-validator';

export class UpdateMetaDto {
  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  valorObjetivo?: number;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
