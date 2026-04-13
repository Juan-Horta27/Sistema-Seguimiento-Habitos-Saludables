import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHabitoDto } from './dto/create-habito.dto';
import { UpdateHabitoDto } from './dto/update-habito.dto';

@Injectable()
export class HabitoRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    categoriaHabito: { select: { id: true, nombre: true } },
    usuario: { select: { id: true, nombres: true, apellidos: true } },
    _count: { select: { registrosDiarios: true, metas: true } },
  };

  async findAll(usuarioId?: number) {
    return this.prisma.habito.findMany({
      where: usuarioId ? { usuarioId } : undefined,
      include: this.include,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    const habito = await this.prisma.habito.findUnique({
      where: { id },
      include: this.include,
    });
    if (!habito) throw new NotFoundException(`Hábito #${id} no encontrado`);
    return habito;
  }

  async create(dto: CreateHabitoDto) {
    // Verificar que la categoría existe
    const categoria = await this.prisma.categoriaHabito.findUnique({
      where: { id: dto.categoriaHabitoId },
    });
    if (!categoria)
      throw new NotFoundException(
        `Categoría #${dto.categoriaHabitoId} no encontrada`,
      );

    // Verificar que el usuario existe
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: dto.usuarioId },
    });
    if (!usuario)
      throw new NotFoundException(`Usuario #${dto.usuarioId} no encontrado`);

    return this.prisma.habito.create({
      data: dto,
      include: this.include,
    });
  }

  async update(id: number, dto: UpdateHabitoDto) {
    await this.findById(id);

    if (dto.categoriaHabitoId) {
      const categoria = await this.prisma.categoriaHabito.findUnique({
        where: { id: dto.categoriaHabitoId },
      });
      if (!categoria)
        throw new NotFoundException(
          `Categoría #${dto.categoriaHabitoId} no encontrada`,
        );
    }

    return this.prisma.habito.update({
      where: { id },
      data: dto,
      include: this.include,
    });
  }

  async remove(id: number) {
    await this.findById(id);

    const registros = await this.prisma.registroDiario.count({
      where: { habitoId: id },
    });
    if (registros > 0)
      throw new ConflictException(
        'No se puede eliminar: el hábito tiene registros diarios asociados',
      );

    return this.prisma.habito.delete({
      where: { id },
      include: this.include,
    });
  }
}
