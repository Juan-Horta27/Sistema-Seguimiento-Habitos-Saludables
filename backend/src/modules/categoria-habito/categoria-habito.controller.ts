import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriaHabitoService } from './categoria-habito.service';
import { CreateCategoriaHabitoDto } from './dto/create-categoria-habito.dto';
import { UpdateCategoriaHabitoDto } from './dto/update-categoria-habito.dto';

@Controller('categorias')
export class CategoriaHabitoController {
  constructor(private readonly categoriaHabitoService: CategoriaHabitoService) {}

  @Get()
  findAll() {
    return this.categoriaHabitoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaHabitoService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateCategoriaHabitoDto) {
    return this.categoriaHabitoService.create(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoriaHabitoDto) {
    return this.categoriaHabitoService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaHabitoService.remove(id);
  }
}
