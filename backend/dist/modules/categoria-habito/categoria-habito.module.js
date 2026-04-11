"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaHabitoModule = void 0;
const common_1 = require("@nestjs/common");
const categoria_habito_service_1 = require("./categoria-habito.service");
const categoria_habito_controller_1 = require("./categoria-habito.controller");
const categoria_habito_repository_1 = require("./categoria-habito.repository");
let CategoriaHabitoModule = class CategoriaHabitoModule {
};
exports.CategoriaHabitoModule = CategoriaHabitoModule;
exports.CategoriaHabitoModule = CategoriaHabitoModule = __decorate([
    (0, common_1.Module)({
        controllers: [categoria_habito_controller_1.CategoriaHabitoController],
        providers: [categoria_habito_service_1.CategoriaHabitoService, categoria_habito_repository_1.CategoriaHabitoRepository],
        exports: [categoria_habito_service_1.CategoriaHabitoService],
    })
], CategoriaHabitoModule);
//# sourceMappingURL=categoria-habito.module.js.map