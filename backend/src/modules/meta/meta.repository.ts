import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';

@Injectable()
export class MetaRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    habito: { select: { id: true, nombre: true, unidadMedida: true } },
  };

  async findAll(habitoId?: number) {
    return this.prisma.meta.findMany({
      where: habitoId ? { habitoId } : undefined,
      include: this.include,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActivas(usuarioId: number) {
    return this.prisma.meta.findMany({
      where: {
        activa: true,
        habito: { usuarioId },
      },
      include: this.include,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    const meta = await this.prisma.meta.findUnique({
      where: { id },
      include: this.include,
    });
    if (!meta) throw new NotFoundException(`Meta #${id} no encontrada`);
    return meta;
  }

  async create(dto: CreateMetaDto) {
    const habito = await this.prisma.habito.findUnique({
      where: { id: dto.habitoId },
    });
    if (!habito)
      throw new NotFoundException(`Hábito #${dto.habitoId} no encontrado`);

    const metaActiva = await this.prisma.meta.findFirst({
      where: { habitoId: dto.habitoId, activa: true },
    });
    if (metaActiva)
      throw new ConflictException(
        `El hábito ya tiene una meta activa (ID #${metaActiva.id}). Desactívala antes de crear una nueva.`,
      );

    return this.prisma.meta.create({
      data: {
        habitoId: dto.habitoId,
        valorObjetivo: dto.valorObjetivo,
        descripcion: dto.descripcion,
      },
      include: this.include,
    });
  }

  async update(id: number, dto: UpdateMetaDto) {
    await this.findById(id);
    return this.prisma.meta.update({
      where: { id },
      data: dto,
      include: this.include,
    });
  }

  async remove(id: number) {
    await this.findById(id);
    return this.prisma.meta.delete({
      where: { id },
      include: this.include,
    });
  }
}
