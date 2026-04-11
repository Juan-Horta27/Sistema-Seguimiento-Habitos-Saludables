import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        usuario: {
            nombres: string;
            apellidos: string;
            correo: string;
            edad: number;
            peso: number;
            estatura: number;
            id: number;
            createdAt: Date;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        usuario: {
            nombres: string;
            apellidos: string;
            correo: string;
            edad: number | null;
            peso: number | null;
            estatura: number | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
}
