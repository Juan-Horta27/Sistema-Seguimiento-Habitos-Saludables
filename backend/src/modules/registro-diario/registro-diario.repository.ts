import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRegistroDiarioDto } from './dto/create-registro-diario.dto';
import { UpdateRegistroDiarioDto } from './dto/update-registro-diario.dto';

@Injectable()
export class RegistroDiarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRegistroDiarioDto & { metaCumplida: boolean }) {
    return this.prisma.registroDiario.create({
      data: {
        habitoId: data.habitoId,
        fecha: new Date(data.fecha),
        valorRegistrado: data.valorRegistrado,
        notas: data.notas,
        metaCumplida: data.metaCumplida,
      },
      include: { habito: { select: { id: true, nombre: true, unidadMedida: true } } },
    });
  }

  async findAll(habitoId?: number) {
    return this.prisma.registroDiario.findMany({
      where: habitoId ? { habitoId } : undefined,
      include: { habito: { select: { id: true, nombre: true, unidadMedida: true } } },
      orderBy: { fecha: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.registroDiario.findUnique({
      where: { id },
      include: { habito: { select: { id: true, nombre: true, unidadMedida: true } } },
    });
  }

  async findByHabitoAndFecha(habitoId: number, fecha: Date) {
    return this.prisma.registroDiario.findUnique({
      where: { habitoId_fecha: { habitoId, fecha } },
    });
  }

  async findResumenSemanal(habitoId: number, fechaInicio: Date, fechaFin: Date) {
    return this.prisma.registroDiario.findMany({
      where: {
        habitoId,
        fecha: { gte: fechaInicio, lte: fechaFin },
      },
      orderBy: { fecha: 'asc' },
    });
  }

  async findByUsuarioSemanal(usuarioId: number, fechaInicio: Date, fechaFin: Date) {
    return this.prisma.registroDiario.findMany({
      where: {
        habito: { usuarioId },
        fecha: { gte: fechaInicio, lte: fechaFin },
      },
      include: { habito: { select: { id: true, nombre: true, unidadMedida: true } } },
      orderBy: { fecha: 'asc' },
    });
  }

  async update(id: number, data: UpdateRegistroDiarioDto & { metaCumplida?: boolean }) {
    const updateData: any = {};
    if (data.valorRegistrado !== undefined) updateData.valorRegistrado = data.valorRegistrado;
    if (data.notas !== undefined) updateData.notas = data.notas;
    if (data.metaCumplida !== undefined) updateData.metaCumplida = data.metaCumplida;

    return this.prisma.registroDiario.update({
      where: { id },
      data: updateData,
      include: { habito: { select: { id: true, nombre: true, unidadMedida: true } } },
    });
  }

  async remove(id: number) {
    return this.prisma.registroDiario.delete({ where: { id } });
  }
}
