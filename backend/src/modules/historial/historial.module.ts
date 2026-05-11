import { Module } from '@nestjs/common';
import { HistorialController } from './historial.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HistorialController],
})
export class HistorialModule {}
