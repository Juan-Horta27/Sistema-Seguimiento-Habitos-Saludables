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
import { HabitoService } from './habito.service';
import { CreateHabitoDto } from './dto/create-habito.dto';
import { UpdateHabitoDto } from './dto/update-habito.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('habitos')
export class HabitoController {
  constructor(private readonly habitoService: HabitoService) {}

  // GET /habitos               → todos los hábitos
  // GET /habitos?usuarioId=1   → filtrar por usuario
  @Get()
  findAll(@Query('usuarioId') usuarioId?: string) {
    return this.habitoService.findAll(usuarioId ? +usuarioId : undefined);
  }

  // GET /habitos/:id
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.habitoService.findById(id);
  }

  // POST /habitos
  @Post()
  create(@Body() dto: CreateHabitoDto) {
    return this.habitoService.create(dto);
  }

  // PUT /habitos/:id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHabitoDto,
  ) {
    return this.habitoService.update(id, dto);
  }

  // DELETE /habitos/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.habitoService.remove(id);
  }
}
