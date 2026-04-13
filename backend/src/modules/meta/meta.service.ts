import { Injectable } from '@nestjs/common';
import { MetaRepository } from './meta.repository';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';

@Injectable()
export class MetaService {
  constructor(private readonly metaRepository: MetaRepository) {}

  findAll(habitoId?: number) {
    return this.metaRepository.findAll(habitoId);
  }

  findActivas(usuarioId: number) {
    return this.metaRepository.findActivas(usuarioId);
  }

  findById(id: number) {
    return this.metaRepository.findById(id);
  }

  create(dto: CreateMetaDto) {
    return this.metaRepository.create(dto);
  }

  update(id: number, dto: UpdateMetaDto) {
    return this.metaRepository.update(id, dto);
  }

  remove(id: number) {
    return this.metaRepository.remove(id);
  }
}
