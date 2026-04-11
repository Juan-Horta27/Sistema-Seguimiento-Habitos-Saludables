"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaHabitoRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CategoriaHabitoRepository = class CategoriaHabitoRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.categoriaHabito.findMany({
            orderBy: { nombre: 'asc' },
        });
    }
    async findById(id) {
        const categoria = await this.prisma.categoriaHabito.findUnique({
            where: { id },
            include: { _count: { select: { habitos: true } } },
        });
        if (!categoria)
            throw new common_1.NotFoundException(`Categoría #${id} no encontrada`);
        return categoria;
    }
    async create(dto) {
        const exists = await this.prisma.categoriaHabito.findUnique({
            where: { nombre: dto.nombre },
        });
        if (exists)
            throw new common_1.ConflictException(`La categoría "${dto.nombre}" ya existe`);
        return this.prisma.categoriaHabito.create({ data: dto });
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.categoriaHabito.update({ where: { id }, data: dto });
    }
    async remove(id) {
        const categoria = await this.findById(id);
        if (categoria._count.habitos > 0) {
            throw new common_1.ConflictException('No se puede eliminar una categoría con hábitos asociados');
        }
        return this.prisma.categoriaHabito.delete({ where: { id } });
    }
};
exports.CategoriaHabitoRepository = CategoriaHabitoRepository;
exports.CategoriaHabitoRepository = CategoriaHabitoRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriaHabitoRepository);
//# sourceMappingURL=categoria-habito.repository.js.map