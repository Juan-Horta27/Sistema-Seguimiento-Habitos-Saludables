import { Module } from '@nestjs/common';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';
import { MetaRepository } from './meta.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [MetaController],
  providers: [MetaService, MetaRepository],
  exports: [MetaService],
})
export class MetaModule {}
