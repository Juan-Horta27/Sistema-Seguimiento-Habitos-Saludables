// backend/src/app.module.ts — versión final con todos los módulos
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { CategoriaHabitoModule } from './modules/categoria-habito/categoria-habito.module';
import { HabitoModule } from './modules/habito/habito.module';
import { MetaModule } from './modules/meta/meta.module';
import { RegistroDiarioModule } from './modules/registro-diario/registro-diario.module';
import { RachaModule } from './modules/racha/racha.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HistorialModule } from './modules/historial/historial.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsuarioModule,
    CategoriaHabitoModule,
    HabitoModule,
    MetaModule,
    RegistroDiarioModule,   // Sprint 3
    RachaModule,            // Sprint 4
    DashboardModule,        // Sprint 4
    HistorialModule,        // Sprint 5
  ],
})
export class AppModule {}
