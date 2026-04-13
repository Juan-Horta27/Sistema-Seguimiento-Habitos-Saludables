import { Module } from '@nestjs/common';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';
import { MetaRepository } from './meta.repository';

@Module({
  controllers: [MetaController],
  providers: [MetaService, MetaRepository],
  exports: [MetaService],
})
export class MetaModule {}
