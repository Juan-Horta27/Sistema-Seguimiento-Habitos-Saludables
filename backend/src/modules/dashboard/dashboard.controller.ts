import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('usuario/:usuarioId')
  async getDashboard(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    // Fecha inicio de la semana actual (lunes)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diaSemana = hoy.getDay();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - ((diaSemana + 6) % 7));
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    domingo.setHours(23, 59, 59, 999);

    // Hábitos activos del usuario
    const habitos = await this.prisma.habito.findMany({
      where: { usuarioId, activo: true },
      include: {
        metas: { where: { activa: true }, take: 1 },
        racha: true,
      },
    });

    // Registros de la semana
    const registrosSemana = await this.prisma.registroDiario.findMany({
      where: {
        habito: { usuarioId },
        fecha: { gte: lunes, lte: domingo },
      },
      include: { habito: { select: { nombre: true } } },
    });

    // Registro de hoy
    const registrosHoy = registrosSemana.filter((r) => {
      const fechaReg = new Date(r.fecha);
      fechaReg.setHours(0, 0, 0, 0);
      return fechaReg.getTime() === hoy.getTime();
    });

    // Estadísticas generales
    const totalHabitos = habitos.length;
    const habitosConRegistroHoy = new Set(registrosHoy.map((r) => r.habitoId)).size;
    const totalRegistrosSemana = registrosSemana.length;
    const metasCumplidasSemana = registrosSemana.filter((r) => r.metaCumplida).length;
    const porcentajeSemana =
      totalRegistrosSemana > 0
        ? Math.round((metasCumplidasSemana / totalRegistrosSemana) * 100)
        : 0;

    // Racha más alta
    const rachas = habitos.filter((h) => h.racha).map((h) => h.racha!);
    const mejorRacha = rachas.reduce(
      (max, r) => (r.rachaActual > max ? r.rachaActual : max),
      0,
    );

    // Mapa de registros por día de la semana (para gráfica)
    const porDia: Record<string, { total: number; cumplidas: number }> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(lunes);
      d.setDate(lunes.getDate() + i);
      const key = d.toISOString().split('T')[0];
      porDia[key] = { total: 0, cumplidas: 0 };
    }
    for (const r of registrosSemana) {
      const key = new Date(r.fecha).toISOString().split('T')[0];
      if (porDia[key]) {
        porDia[key].total++;
        if (r.metaCumplida) porDia[key].cumplidas++;
      }
    }

    return {
      resumen: {
        totalHabitos,
        habitosRegistradosHoy: habitosConRegistroHoy,
        porcentajeCompletadoHoy:
          totalHabitos > 0 ? Math.round((habitosConRegistroHoy / totalHabitos) * 100) : 0,
        totalRegistrosSemana,
        metasCumplidasSemana,
        porcentajeSemana,
        mejorRachaActual: mejorRacha,
      },
      actividadSemanal: Object.entries(porDia).map(([fecha, stats]) => ({
        fecha,
        ...stats,
        porcentaje: stats.total > 0 ? Math.round((stats.cumplidas / stats.total) * 100) : 0,
      })),
      habitos: habitos.map((h) => ({
        id: h.id,
        nombre: h.nombre,
        unidadMedida: h.unidadMedida,
        metaActiva: h.metas[0] ?? null,
        racha: h.racha ?? { rachaActual: 0, rachaMaxima: 0 },
      })),
      registrosHoy,
    };
  }
}
