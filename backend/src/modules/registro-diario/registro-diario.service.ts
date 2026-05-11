import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { RegistroDiarioRepository } from './registro-diario.repository';
import { CreateRegistroDiarioDto } from './dto/create-registro-diario.dto';
import { UpdateRegistroDiarioDto } from './dto/update-registro-diario.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RegistroDiarioService {
  constructor(
    private readonly repo: RegistroDiarioRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateRegistroDiarioDto) {
    const habito = await this.prisma.habito.findUnique({
      where: { id: dto.habitoId },
      include: {
        metas: { where: { activa: true }, take: 1 },
      },
    });
    if (!habito) throw new NotFoundException(`Hábito #${dto.habitoId} no encontrado`);

    const fechaDate = new Date(dto.fecha);
    const existing = await this.repo.findByHabitoAndFecha(dto.habitoId, fechaDate);
    if (existing) {
      throw new ConflictException(
        `Ya existe un registro para el hábito #${dto.habitoId} en la fecha ${dto.fecha}`,
      );
    }

    const metaActiva = habito.metas[0];
    const metaCumplida = metaActiva
      ? dto.valorRegistrado >= metaActiva.valorObjetivo
      : false;

    const registro = await this.repo.create({ ...dto, metaCumplida });
    await this.actualizarRacha(dto.habitoId);
    return registro;
  }

  async findAll(habitoId?: number) {
    return this.repo.findAll(habitoId);
  }

  async findOne(id: number) {
    const registro = await this.repo.findOne(id);
    if (!registro) throw new NotFoundException(`Registro diario #${id} no encontrado`);
    return registro;
  }

  async resumenSemanal(habitoId: number, fechaRef?: string) {
    const habito = await this.prisma.habito.findUnique({
      where: { id: habitoId },
      include: { metas: { where: { activa: true }, take: 1 } },
    });
    if (!habito) throw new NotFoundException(`Hábito #${habitoId} no encontrado`);

    const ref = fechaRef ? new Date(fechaRef) : new Date();
    const diaSemana = ref.getDay();
    const lunes = new Date(ref);
    lunes.setDate(ref.getDate() - ((diaSemana + 6) % 7));
    lunes.setHours(0, 0, 0, 0);
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    domingo.setHours(23, 59, 59, 999);

    const registros = await this.repo.findResumenSemanal(habitoId, lunes, domingo);
    const metaActiva = habito.metas[0];

    const totalDias = registros.length;
    const diasCumplidos = registros.filter((r) => r.metaCumplida).length;
    const totalValor = registros.reduce((s, r) => s + r.valorRegistrado, 0);
    const promedio = totalDias > 0 ? totalValor / totalDias : 0;

    return {
      habito: { id: habito.id, nombre: habito.nombre, unidadMedida: habito.unidadMedida },
      semana: {
        inicio: lunes.toISOString().split('T')[0],
        fin: domingo.toISOString().split('T')[0],
      },
      metaActiva: metaActiva
        ? { valorObjetivo: metaActiva.valorObjetivo, descripcion: metaActiva.descripcion }
        : null,
      estadisticas: {
        totalDiasRegistrados: totalDias,
        diasCumplidos,
        porcentajeCumplimiento: totalDias > 0 ? Math.round((diasCumplidos / 7) * 100) : 0,
        totalValor: Math.round(totalValor * 100) / 100,
        promedioDiario: Math.round(promedio * 100) / 100,
      },
      registros,
    };
  }

  async resumenSemanalUsuario(usuarioId: number, fechaRef?: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException(`Usuario #${usuarioId} no encontrado`);

    const ref = fechaRef ? new Date(fechaRef) : new Date();
    const diaSemana = ref.getDay();
    const lunes = new Date(ref);
    lunes.setDate(ref.getDate() - ((diaSemana + 6) % 7));
    lunes.setHours(0, 0, 0, 0);
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    domingo.setHours(23, 59, 59, 999);

    const registros = await this.repo.findByUsuarioSemanal(usuarioId, lunes, domingo);

    const porHabito: Record<number, any> = {};
    for (const r of registros) {
      if (!porHabito[r.habitoId]) {
        porHabito[r.habitoId] = {
          habito: r.habito,
          registros: [],
          diasCumplidos: 0,
        };
      }
      porHabito[r.habitoId].registros.push(r);
      if (r.metaCumplida) porHabito[r.habitoId].diasCumplidos++;
    }

    return {
      usuarioId,
      semana: {
        inicio: lunes.toISOString().split('T')[0],
        fin: domingo.toISOString().split('T')[0],
      },
      habitos: Object.values(porHabito),
    };
  }

  async update(id: number, dto: UpdateRegistroDiarioDto) {
    const registro = await this.repo.findOne(id);
    if (!registro) throw new NotFoundException(`Registro diario #${id} no encontrado`);

    let metaCumplida: boolean | undefined;
    if (dto.valorRegistrado !== undefined) {
      const habito = await this.prisma.habito.findUnique({
        where: { id: registro.habitoId },
        include: { metas: { where: { activa: true }, take: 1 } },
      });
      const metaActiva = habito?.metas[0];
      metaCumplida = metaActiva ? dto.valorRegistrado >= metaActiva.valorObjetivo : false;
    }

    const updated = await this.repo.update(id, { ...dto, metaCumplida });
    await this.actualizarRacha(registro.habitoId);
    return updated;
  }

  async remove(id: number) {
    const registro = await this.repo.findOne(id);
    if (!registro) throw new NotFoundException(`Registro diario #${id} no encontrado`);
    await this.repo.remove(id);
    await this.actualizarRacha(registro.habitoId);
    return { message: `Registro diario #${id} eliminado correctamente` };
  }

  private async actualizarRacha(habitoId: number) {
    const registros = await this.prisma.registroDiario.findMany({
      where: { habitoId, metaCumplida: true },
      orderBy: { fecha: 'desc' },
    });

    let rachaActual = 0;
    let rachaMaxima = 0;
    let tempRacha = 0;
    let fechaAnterior: Date | null = null;

    for (const reg of registros) {
      const fecha = new Date(reg.fecha);
      fecha.setHours(0, 0, 0, 0);

      if (fechaAnterior === null) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const ayer = new Date(hoy);
        ayer.setDate(hoy.getDate() - 1);
        if (fecha.getTime() === hoy.getTime() || fecha.getTime() === ayer.getTime()) {
          rachaActual = 1;
          tempRacha = 1;
        } else {
          rachaActual = 0;
          tempRacha = 1;
        }
      } else {
        const diff = (fechaAnterior.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          tempRacha++;
          if (rachaActual > 0) rachaActual++;
        } else {
          if (tempRacha > rachaMaxima) rachaMaxima = tempRacha;
          tempRacha = 1;
        }
      }
      fechaAnterior = fecha;
    }
    if (tempRacha > rachaMaxima) rachaMaxima = tempRacha;

    await this.prisma.racha.upsert({
      where: { habitoId },
      update: { rachaActual, rachaMaxima },
      create: { habitoId, rachaActual, rachaMaxima },
    });
  }
}
