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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const exists = await this.prisma.usuario.findUnique({
            where: { correo: dto.correo },
        });
        if (exists) {
            throw new common_1.ConflictException('El correo ya está registrado');
        }
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
    async login(dto) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { correo: dto.correo },
        });
        if (!usuario) {
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        const valid = await bcrypt.compare(dto.contrasena, usuario.contrasena);
        if (!valid) {
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        const { contrasena, ...data } = usuario;
        const token = this.jwtService.sign({ sub: usuario.id, correo: usuario.correo });
        return { usuario: data, token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map