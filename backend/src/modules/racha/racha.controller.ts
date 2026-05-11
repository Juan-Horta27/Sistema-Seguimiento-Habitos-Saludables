import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('rachas')
export class RachaController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.racha.findMany({
      include: { habito: { select: { id: true, nombre: true, unidadMedida: true } } },
      orderBy: { rachaActual: 'desc' },
    });
  }

  @Get('usuario/:usuarioId')
  async findByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    const rachas = await this.prisma.racha.findMany({
      where: { habito: { usuarioId } },
      include: {
        habito: {
          select: {
            id: true,
            nombre: true,
            unidadMedida: true,
            metas: { where: { activa: true }, take: 1 },
          },
        },
      },
      orderBy: { rachaActual: 'desc' },
    });
    return rachas;
  }

  @Get('habito/:habitoId')
  async findByHabito(@Param('habitoId', ParseIntPipe) habitoId: number) {
    const racha = await this.prisma.racha.findUnique({
      where: { habitoId },
      include: { habito: { select: { id: true, nombre: true, unidadMedida: true } } },
    });
    return racha;
  }
}
