import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { CategoriaHabitoModule } from './modules/categoria-habito/categoria-habito.module';
import { HabitoModule } from './modules/habito/habito.module';
import { MetaModule } from './modules/meta/meta.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsuarioModule,
    CategoriaHabitoModule,
    HabitoModule,
    MetaModule,
  ],
})
export class AppModule {}
