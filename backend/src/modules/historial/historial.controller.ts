import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('historial')
export class HistorialController {
  constructor(private readonly prisma: PrismaService) {}

  // GET /historial/mensual?usuarioId=1&anio=2026&mes=5
  @Get('mensual')
  async mensual(
    @Query('usuarioId', ParseIntPipe) usuarioId: number,
    @Query('anio') anio?: string,
    @Query('mes') mes?: string,
  ) {
    const now = new Date();
    const a = anio ? +anio : now.getFullYear();
    const m = mes ? +mes - 1 : now.getMonth(); // 0-indexed

    const inicio = new Date(a, m, 1);
    const fin = new Date(a, m + 1, 0, 23, 59, 59, 999);

    const registros = await this.prisma.registroDiario.findMany({
      where: {
        habito: { usuarioId },
        fecha: { gte: inicio, lte: fin },
      },
      include: {
        habito: { select: { id: true, nombre: true, unidadMedida: true } },
      },
      orderBy: { fecha: 'asc' },
    });

    const totalDias = registros.length;
    const diasCumplidos = registros.filter((r) => r.metaCumplida).length;

    // Agrupar por hábito
    const porHabito: Record<number, any> = {};
    for (const r of registros) {
      if (!porHabito[r.habitoId]) {
        porHabito[r.habitoId] = {
          habito: r.habito,
          registros: [],
          diasCumplidos: 0,
          totalValor: 0,
        };
      }
      porHabito[r.habitoId].registros.push(r);
      if (r.metaCumplida) porHabito[r.habitoId].diasCumplidos++;
      porHabito[r.habitoId].totalValor += r.valorRegistrado;
    }

    return {
      periodo: {
        anio: a,
        mes: m + 1,
        nombre: inicio.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }),
        diasEnMes: fin.getDate(),
      },
      estadisticasGenerales: {
        totalRegistros: totalDias,
        metasCumplidas: diasCumplidos,
        porcentajeCumplimiento:
          totalDias > 0 ? Math.round((diasCumplidos / totalDias) * 100) : 0,
      },
      habitos: Object.values(porHabito).map((h: any) => ({
        ...h,
        promedioDiario: h.registros.length > 0
          ? Math.round((h.totalValor / h.registros.length) * 100) / 100
          : 0,
        porcentajeCumplimiento: h.registros.length > 0
          ? Math.round((h.diasCumplidos / h.registros.length) * 100)
          : 0,
      })),
    };
  }

  // GET /historial/rango?usuarioId=1&desde=2026-01-01&hasta=2026-05-31
  @Get('rango')
  async porRango(
    @Query('usuarioId', ParseIntPipe) usuarioId: number,
    @Query('desde') desde: string,
    @Query('hasta') hasta: string,
  ) {
    if (!desde || !hasta) {
      throw new BadRequestException('Los parámetros "desde" y "hasta" son requeridos (formato: YYYY-MM-DD)');
    }

    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    fechaHasta.setHours(23, 59, 59, 999);

    if (fechaDesde > fechaHasta) {
      throw new BadRequestException('"desde" no puede ser mayor que "hasta"');
    }

    const registros = await this.prisma.registroDiario.findMany({
      where: {
        habito: { usuarioId },
        fecha: { gte: fechaDesde, lte: fechaHasta },
      },
      include: {
        habito: { select: { id: true, nombre: true, unidadMedida: true } },
      },
      orderBy: { fecha: 'asc' },
    });

    // Agrupar por semana
    const porSemana: Record<string, { inicio: string; fin: string; registros: any[]; cumplidas: number }> = {};

    for (const r of registros) {
      const fecha = new Date(r.fecha);
      const lunes = new Date(fecha);
      lunes.setDate(fecha.getDate() - ((fecha.getDay() + 6) % 7));
      const domingo = new Date(lunes);
      domingo.setDate(lunes.getDate() + 6);
      const key = lunes.toISOString().split('T')[0];

      if (!porSemana[key]) {
        porSemana[key] = {
          inicio: lunes.toISOString().split('T')[0],
          fin: domingo.toISOString().split('T')[0],
          registros: [],
          cumplidas: 0,
        };
      }
      porSemana[key].registros.push(r);
      if (r.metaCumplida) porSemana[key].cumplidas++;
    }

    const totalRegistros = registros.length;
    const metasCumplidas = registros.filter((r) => r.metaCumplida).length;

    return {
      rango: { desde, hasta },
      estadisticasGenerales: {
        totalRegistros,
        metasCumplidas,
        porcentajeCumplimiento:
          totalRegistros > 0 ? Math.round((metasCumplidas / totalRegistros) * 100) : 0,
      },
      semanas: Object.values(porSemana).map((s) => ({
        ...s,
        porcentaje: s.registros.length > 0
          ? Math.round((s.cumplidas / s.registros.length) * 100)
          : 0,
      })),
      registros,
    };
  }
}
