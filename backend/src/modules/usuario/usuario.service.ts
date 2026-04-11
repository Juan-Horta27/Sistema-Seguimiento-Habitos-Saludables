import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from './usuario.repository';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  findAll() {
    return this.usuarioRepository.findAll();
  }

  findOne(id: number) {
    return this.usuarioRepository.findById(id);
  }

  create(dto: CreateUsuarioDto) {
    return this.usuarioRepository.create(dto);
  }

  update(id: number, dto: UpdateUsuarioDto) {
    return this.usuarioRepository.update(id, dto);
  }

  remove(id: number) {
    return this.usuarioRepository.remove(id);
  }
}
