import { CategoriaHabitoRepository } from './categoria-habito.repository';
import { CreateCategoriaHabitoDto } from './dto/create-categoria-habito.dto';
import { UpdateCategoriaHabitoDto } from './dto/update-categoria-habito.dto';
export declare class CategoriaHabitoService {
    private readonly categoriaHabitoRepository;
    constructor(categoriaHabitoRepository: CategoriaHabitoRepository);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        descripcion: string | null;
    }[]>;
    findOne(id: number): Promise<{
        _count: {
            habitos: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        descripcion: string | null;
    }>;
    create(dto: CreateCategoriaHabitoDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        descripcion: string | null;
    }>;
    update(id: number, dto: UpdateCategoriaHabitoDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        descripcion: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        nombre: string;
        descripcion: string | null;
    }>;
}
