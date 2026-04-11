import { Injectable } from '@nestjs/common';
import { CategoriaHabitoRepository } from './categoria-habito.repository';
import { CreateCategoriaHabitoDto } from './dto/create-categoria-habito.dto';
import { UpdateCategoriaHabitoDto } from './dto/update-categoria-habito.dto';

@Injectable()
export class CategoriaHabitoService {
  constructor(private readonly categoriaHabitoRepository: CategoriaHabitoRepository) {}

  findAll() {
    return this.categoriaHabitoRepository.findAll();
  }

  findOne(id: number) {
    return this.categoriaHabitoRepository.findById(id);
  }

  create(dto: CreateCategoriaHabitoDto) {
    return this.categoriaHabitoRepository.create(dto);
  }

  update(id: number, dto: UpdateCategoriaHabitoDto) {
    return this.categoriaHabitoRepository.update(id, dto);
  }

  remove(id: number) {
    return this.categoriaHabitoRepository.remove(id);
  }
}
