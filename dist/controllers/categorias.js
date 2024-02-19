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
exports.postCategoria = void 0;
const categoria_1 = __importDefault(require("../models/categoria"));
const postCategoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*     try { */
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = yield categoria_1.default.findOne({
        where: {
            nombre: nombre
        }
    });
    console.log("categoria en bd:", categoriaDB);
    if (categoriaDB) {
        console.log("entro a if categoria");
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}. ya existe`
        });
    }
    ;
    const usuarioAuthenticado = req.app.locals;
    const data = {
        nombre,
        userCreated: usuarioAuthenticado.id
    };
    //construir el modelo de categoria
    const categoria = categoria_1.default.build(data);
    yield categoria.save();
    res.status(201).json({
        categoria
    });
    /*     } catch (error) {
            
            res.status(500).json({
                msg : 'hable con el administrador',
                error: error
            })
        } */
});
exports.postCategoria = postCategoria;
//# sourceMappingURL=categorias.js.map