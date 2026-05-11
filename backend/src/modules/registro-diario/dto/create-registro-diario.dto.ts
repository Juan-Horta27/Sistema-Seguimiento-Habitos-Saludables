import {
  IsInt,
  IsPositive,
  IsNumber,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRegistroDiarioDto {
  @IsInt()
  @IsPositive()
  habitoId: number;

  @IsDateString()
  fecha: string; // formato: "2026-05-08"

  @IsNumber()
  @IsPositive()
  valorRegistrado: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notas?: string;
}
