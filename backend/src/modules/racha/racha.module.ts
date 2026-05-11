import { Module } from '@nestjs/common';
import { RachaController } from './racha.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RachaController],
})
export class RachaModule {}
