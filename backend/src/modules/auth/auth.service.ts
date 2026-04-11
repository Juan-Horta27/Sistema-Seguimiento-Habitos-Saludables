import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Verificar si el correo ya existe
    const exists = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });
    if (exists) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Hashear la contraseña
    const hash = await bcrypt.hash(dto.contrasena, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        nombres: dto.nombres,
        apellidos: dto.apellidos,
        correo: dto.correo,
        contrasena: hash,
        edad: dto.edad,
        peso: dto.peso,
        estatura: dto.estatura,
      },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        correo: true,
        edad: true,
        peso: true,
        estatura: true,
        createdAt: true,
      },
    });

    const token = this.jwtService.sign({ sub: usuario.id, correo: usuario.correo });
    return { usuario, token };
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const valid = await bcrypt.compare(dto.contrasena, usuario.contrasena);
    if (!valid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const { contrasena, ...data } = usuario;
    const token = this.jwtService.sign({ sub: usuario.id, correo: usuario.correo });
    return { usuario: data, token };
  }
}
