"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const usuario_1 = __importDefault(require("./usuario"));
const Categoria = connection_1.default.define('Categoria', {
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    userCreated: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: usuario_1.default,
            key: 'id'
        }
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.Sequelize.fn('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
});
Categoria.belongsTo(usuario_1.default, { foreignKey: 'userCreated', as: 'usuario' });
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Categoria.sync();
        console.log('Modelo Categoria sincronizado correctamente');
    }
    catch (error) {
        console.error('Error al sincronizar el modelo Categoria:', error);
    }
}))();
exports.default = Categoria;
//# sourceMappingURL=categoria.js.map