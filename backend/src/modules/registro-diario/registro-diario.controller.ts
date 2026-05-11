import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RegistroDiarioService } from './registro-diario.service';
import { CreateRegistroDiarioDto } from './dto/create-registro-diario.dto';
import { UpdateRegistroDiarioDto } from './dto/update-registro-diario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('registros')
export class RegistroDiarioController {
  constructor(private readonly service: RegistroDiarioService) {}

  @Post()
  create(@Body() dto: CreateRegistroDiarioDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('habitoId') habitoId?: string) {
    return this.service.findAll(habitoId ? +habitoId : undefined);
  }

  @Get('resumen/semanal')
  resumenSemanalUsuario(
    @Query('usuarioId', ParseIntPipe) usuarioId: number,
    @Query('fecha') fecha?: string,
  ) {
    return this.service.resumenSemanalUsuario(usuarioId, fecha);
  }

  @Get('resumen/habito/:habitoId')
  resumenSemanal(
    @Param('habitoId', ParseIntPipe) habitoId: number,
    @Query('fecha') fecha?: string,
  ) {
    return this.service.resumenSemanal(habitoId, fecha);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRegistroDiarioDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
