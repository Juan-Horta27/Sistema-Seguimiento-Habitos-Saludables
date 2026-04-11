import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoriaHabitoDto } from './dto/create-categoria-habito.dto';
import { UpdateCategoriaHabitoDto } from './dto/update-categoria-habito.dto';

@Injectable()
export class CategoriaHabitoRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.categoriaHabito.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async findById(id: number) {
    const categoria = await this.prisma.categoriaHabito.findUnique({
      where: { id },
      include: { _count: { select: { habitos: true } } },
    });
    if (!categoria) throw new NotFoundException(`Categoría #${id} no encontrada`);
    return categoria;
  }

  async create(dto: CreateCategoriaHabitoDto) {
    const exists = await this.prisma.categoriaHabito.findUnique({
      where: { nombre: dto.nombre },
    });
    if (exists) throw new ConflictException(`La categoría "${dto.nombre}" ya existe`);
    return this.prisma.categoriaHabito.create({ data: dto });
  }

  async update(id: number, dto: UpdateCategoriaHabitoDto) {
    await this.findById(id);
    return this.prisma.categoriaHabito.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const categoria = await this.findById(id);
    if (categoria._count.habitos > 0) {
      throw new ConflictException('No se puede eliminar una categoría con hábitos asociados');
    }
    return this.prisma.categoriaHabito.delete({ where: { id } });
  }
}
