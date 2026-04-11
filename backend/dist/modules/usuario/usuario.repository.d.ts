import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
export declare class UsuarioRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly select;
    findAll(): Promise<{
        nombres: string;
        apellidos: string;
        correo: string;
        edad: number;
        peso: number;
        estatura: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findById(id: number): Promise<{
        nombres: string;
        apellidos: string;
        correo: string;
        edad: number;
        peso: number;
        estatura: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateUsuarioDto): Promise<{
        nombres: string;
        apellidos: string;
        correo: string;
        edad: number;
        peso: number;
        estatura: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, dto: UpdateUsuarioDto): Promise<{
        nombres: string;
        apellidos: string;
        correo: string;
        edad: number;
        peso: number;
        estatura: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        nombres: string;
        apellidos: string;
        correo: string;
        edad: number;
        peso: number;
        estatura: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
