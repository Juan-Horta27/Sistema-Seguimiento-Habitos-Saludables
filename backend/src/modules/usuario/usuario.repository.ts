import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly select = {
    id: true,
    nombres: true,
    apellidos: true,
    correo: true,
    edad: true,
    peso: true,
    estatura: true,
    createdAt: true,
    updatedAt: true,
  };

  async findAll() {
    return this.prisma.usuario.findMany({ select: this.select });
  }

  async findById(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: this.select,
    });
    if (!usuario) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return usuario;
  }

  async create(dto: CreateUsuarioDto) {
    const exists = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });
    if (exists) throw new ConflictException('El correo ya está registrado');

    const hash = await bcrypt.hash(dto.contrasena, 10);
    return this.prisma.usuario.create({
      data: { ...dto, contrasena: hash },
      select: this.select,
    });
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    await this.findById(id);
    return this.prisma.usuario.update({
      where: { id },
      data: dto,
      select: this.select,
    });
  }

  async remove(id: number) {
    await this.findById(id);
    const tieneHabitos = await this.prisma.habito.count({ where: { usuarioId: id } });
    if (tieneHabitos > 0) {
      throw new ConflictException('No se puede eliminar un usuario con hábitos activos');
    }
    return this.prisma.usuario.delete({ where: { id }, select: this.select });
  }
}
