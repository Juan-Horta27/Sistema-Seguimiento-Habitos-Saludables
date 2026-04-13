import { Injectable } from '@nestjs/common';
import { HabitoRepository } from './habito.repository';
import { CreateHabitoDto } from './dto/create-habito.dto';
import { UpdateHabitoDto } from './dto/update-habito.dto';

@Injectable()
export class HabitoService {
  constructor(private readonly habitoRepository: HabitoRepository) {}

  findAll(usuarioId?: number) {
    return this.habitoRepository.findAll(usuarioId);
  }

  findById(id: number) {
    return this.habitoRepository.findById(id);
  }

  create(dto: CreateHabitoDto) {
    return this.habitoRepository.create(dto);
  }

  update(id: number, dto: UpdateHabitoDto) {
    return this.habitoRepository.update(id, dto);
  }

  remove(id: number) {
    return this.habitoRepository.remove(id);
  }
}
