import { Module } from '@nestjs/common';
import { CategoriaHabitoService } from './categoria-habito.service';
import { CategoriaHabitoController } from './categoria-habito.controller';
import { CategoriaHabitoRepository } from './categoria-habito.repository';

@Module({
  controllers: [CategoriaHabitoController],
  providers: [CategoriaHabitoService, CategoriaHabitoRepository],
  exports: [CategoriaHabitoService],
})
export class CategoriaHabitoModule {}
