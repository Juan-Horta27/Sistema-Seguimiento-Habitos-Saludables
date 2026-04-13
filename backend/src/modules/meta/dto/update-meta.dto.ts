import { IsString, IsOptional, IsNumber, IsPositive, IsBoolean } from 'class-validator';

export class UpdateMetaDto {
  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  valorMeta?: number;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
