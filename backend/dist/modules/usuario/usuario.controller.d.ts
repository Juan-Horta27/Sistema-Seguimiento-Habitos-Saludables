import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
export declare class UsuarioController {
    private readonly usuarioService;
    constructor(usuarioService: UsuarioService);
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
    findOne(id: number): Promise<{
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
