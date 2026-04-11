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
exports.UsuarioRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
let UsuarioRepository = class UsuarioRepository {
    constructor(prisma) {
        this.prisma = prisma;
        this.select = {
            id: true,
            nombres: true,
            apellidos: true,
            correo: true,
            edad: true,
            peso: true,
            estatura: true,
            createdAt: true,
            updatedAt: true,
        };
    }
    async findAll() {
        return this.prisma.usuario.findMany({ select: this.select });
    }
    async findById(id) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id },
            select: this.select,
        });
        if (!usuario)
            throw new common_1.NotFoundException(`Usuario #${id} no encontrado`);
        return usuario;
    }
    async create(dto) {
        const exists = await this.prisma.usuario.findUnique({
            where: { correo: dto.correo },
        });
        if (exists)
            throw new common_1.ConflictException('El correo ya está registrado');
        const hash = await bcrypt.hash(dto.contrasena, 10);
        return this.prisma.usuario.create({
            data: { ...dto, contrasena: hash },
            select: this.select,
        });
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.usuario.update({
            where: { id },
            data: dto,
            select: this.select,
        });
    }
    async remove(id) {
        await this.findById(id);
        const tieneHabitos = await this.prisma.habito.count({ where: { usuarioId: id } });
        if (tieneHabitos > 0) {
            throw new common_1.ConflictException('No se puede eliminar un usuario con hábitos activos');
        }
        return this.prisma.usuario.delete({ where: { id }, select: this.select });
    }
};
exports.UsuarioRepository = UsuarioRepository;
exports.UsuarioRepository = UsuarioRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsuarioRepository);
//# sourceMappingURL=usuario.repository.js.map