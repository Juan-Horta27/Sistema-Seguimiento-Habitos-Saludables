import { Module } from '@nestjs/common';
import { RegistroDiarioController } from './registro-diario.controller';
import { RegistroDiarioService } from './registro-diario.service';
import { RegistroDiarioRepository } from './registro-diario.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RegistroDiarioController],
  providers: [RegistroDiarioService, RegistroDiarioRepository],
  exports: [RegistroDiarioService],
})
export class RegistroDiarioModule {}
