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
exports.CategoriaHabitoService = void 0;
const common_1 = require("@nestjs/common");
const categoria_habito_repository_1 = require("./categoria-habito.repository");
let CategoriaHabitoService = class CategoriaHabitoService {
    constructor(categoriaHabitoRepository) {
        this.categoriaHabitoRepository = categoriaHabitoRepository;
    }
    findAll() {
        return this.categoriaHabitoRepository.findAll();
    }
    findOne(id) {
        return this.categoriaHabitoRepository.findById(id);
    }
    create(dto) {
        return this.categoriaHabitoRepository.create(dto);
    }
    update(id, dto) {
        return this.categoriaHabitoRepository.update(id, dto);
    }
    remove(id) {
        return this.categoriaHabitoRepository.remove(id);
    }
};
exports.CategoriaHabitoService = CategoriaHabitoService;
exports.CategoriaHabitoService = CategoriaHabitoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [categoria_habito_repository_1.CategoriaHabitoRepository])
], CategoriaHabitoService);
//# sourceMappingURL=categoria-habito.service.js.map