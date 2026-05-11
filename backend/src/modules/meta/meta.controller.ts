import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MetaService } from './meta.service';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('metas')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  // GET /metas                    → todas las metas
  // GET /metas?habitoId=1         → filtrar por hábito
  // GET /metas?activas=1&usuarioId=1  → solo activas de un usuario
  @Get()
  findAll(
    @Query('habitoId') habitoId?: string,
    @Query('activas') activas?: string,
    @Query('usuarioId') usuarioId?: string,
  ) {
    if (activas === '1' && usuarioId) {
      return this.metaService.findActivas(+usuarioId);
    }
    return this.metaService.findAll(habitoId ? +habitoId : undefined);
  }

  // GET /metas/:id
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.metaService.findById(id);
  }

  // POST /metas
  @Post()
  create(@Body() dto: CreateMetaDto) {
    return this.metaService.create(dto);
  }

  // PUT /metas/:id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMetaDto,
  ) {
    return this.metaService.update(id, dto);
  }

  // DELETE /metas/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.metaService.remove(id);
  }
}
