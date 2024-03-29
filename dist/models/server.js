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
const express_1 = __importDefault(require("express"));
const usuarios_1 = __importDefault(require("../routes/usuarios"));
const roles_1 = __importDefault(require("../routes/roles"));
const auth_1 = __importDefault(require("../routes/auth"));
const categorias_1 = __importDefault(require("../routes/categorias"));
const carpetas_1 = __importDefault(require("../routes/carpetas"));
const contenedor_azure_1 = __importDefault(require("../routes/contenedor-azure"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("../db/connection"));
class Server {
    constructor() {
        this.apiPaths = {
            usuarios: '/api/usuarios',
            roles: '/api/roles',
            auth: '/api/auth',
            categorias: '/api/categorias',
            carpetas: '/api/carpetas',
            contenedores: '/api/contenedores'
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8080';
        this.dbConnection();
        this.middlewares();
        //Definir mis rutas
        this.routes();
    }
    ;
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
                console.log("base de datos online");
            }
            catch (error) {
                if (typeof error === 'string') {
                    throw new Error(error);
                }
                else {
                    throw new Error('Error desconocido');
                }
            }
        });
    }
    middlewares() {
        // cors
        this.app.use((0, cors_1.default)({
            origin: 'http://localhost:4200',
            optionsSuccessStatus: 200, // Algunos navegadores antiguos (IE11) interpretan mal el éxito con 204
        }));
        // Lectura del body
        this.app.use(express_1.default.json());
        //carga carpeta punlica
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(this.apiPaths.auth, auth_1.default);
        this.app.use(this.apiPaths.usuarios, usuarios_1.default);
        this.app.use(this.apiPaths.roles, roles_1.default);
        this.app.use(this.apiPaths.categorias, categorias_1.default);
        this.app.use(this.apiPaths.carpetas, carpetas_1.default);
        this.app.use(this.apiPaths.contenedores, contenedor_azure_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('El servidor corriendo en puerto:' + this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map