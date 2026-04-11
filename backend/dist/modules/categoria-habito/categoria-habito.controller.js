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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaHabitoController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const categoria_habito_service_1 = require("./categoria-habito.service");
const create_categoria_habito_dto_1 = require("./dto/create-categoria-habito.dto");
const update_categoria_habito_dto_1 = require("./dto/update-categoria-habito.dto");
let CategoriaHabitoController = class CategoriaHabitoController {
    constructor(categoriaHabitoService) {
        this.categoriaHabitoService = categoriaHabitoService;
    }
    findAll() {
        return this.categoriaHabitoService.findAll();
    }
    findOne(id) {
        return this.categoriaHabitoService.findOne(id);
    }
    create(dto) {
        return this.categoriaHabitoService.create(dto);
    }
    update(id, dto) {
        return this.categoriaHabitoService.update(id, dto);
    }
    remove(id) {
        return this.categoriaHabitoService.remove(id);
    }
};
exports.CategoriaHabitoController = CategoriaHabitoController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriaHabitoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoriaHabitoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_categoria_habito_dto_1.CreateCategoriaHabitoDto]),
    __metadata("design:returntype", void 0)
], CategoriaHabitoController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_categoria_habito_dto_1.UpdateCategoriaHabitoDto]),
    __metadata("design:returntype", void 0)
], CategoriaHabitoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CategoriaHabitoController.prototype, "remove", null);
exports.CategoriaHabitoController = CategoriaHabitoController = __decorate([
    (0, common_1.Controller)('categorias'),
    __metadata("design:paramtypes", [categoria_habito_service_1.CategoriaHabitoService])
], CategoriaHabitoController);
//# sourceMappingURL=categoria-habito.controller.js.map