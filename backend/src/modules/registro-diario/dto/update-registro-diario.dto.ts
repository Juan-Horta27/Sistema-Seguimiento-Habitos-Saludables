import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroDiarioDto } from './create-registro-diario.dto';

export class UpdateRegistroDiarioDto extends PartialType(CreateRegistroDiarioDto) {}
