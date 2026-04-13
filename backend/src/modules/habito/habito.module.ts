import { Module } from '@nestjs/common';
import { HabitoController } from './habito.controller';
import { HabitoService } from './habito.service';
import { HabitoRepository } from './habito.repository';

@Module({
  controllers: [HabitoController],
  providers: [HabitoService, HabitoRepository],
  exports: [HabitoService],
})
export class HabitoModule {}
