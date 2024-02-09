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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsuario = exports.putUsuario = exports.postUsuario = exports.getUsuario = exports.getUsuarios = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { size = 5, page = 1 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(size);
    const usuarios = yield usuario_1.default.findAndCountAll({
        limit: parseInt(size),
        offset: offset,
        order: [["id", "DESC"]],
        where: {
            estado: true
        }
    });
    res.json(usuarios);
});
exports.getUsuarios = getUsuarios;
const getUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const usuario = yield usuario_1.default.findByPk(id);
    if (usuario) {
        res.json(usuario);
    }
    else {
        res.status(404).json({
            msg: `No existe un usuario con el id ${id}`
        });
    }
});
exports.getUsuario = getUsuario;
const postUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { nombre, correo, password, role } = req.body;
    try {
        //encriptar contrasena
        const salt = bcryptjs_1.default.genSaltSync();
        password = bcryptjs_1.default.hashSync(password, salt);
        //construir el modelo de usuario
        const usuario = usuario_1.default.build({ nombre, correo, password, role });
        console.log("usuario:", usuario);
        //guarda usuario en la bd
        yield usuario.save();
        res.json({
            usuario
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'hable con el administrador',
            error: error
        });
    }
});
exports.postUsuario = postUsuario;
const putUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let _a = req.body, { google } = _a, resto = __rest(_a, ["google"]);
    try {
        if (resto.password) {
            //encriptar contrasena
            const salt = bcryptjs_1.default.genSaltSync();
            resto.password = bcryptjs_1.default.hashSync(resto.password, salt);
        }
        ;
        const usuario = yield usuario_1.default.findByPk(id);
        console.log(usuario);
        if (!usuario) {
            return res.status(400).json({
                msg: "No existe el usuario con el id: " + id
            });
        }
        yield (usuario === null || usuario === void 0 ? void 0 : usuario.update(resto));
        res.json({
            msg: 'Put Usuario',
            usuario
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'hable con el administrador',
            error: error
        });
    }
});
exports.putUsuario = putUsuario;
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    const usuarioAuthenticado = req.app.locals;
    const usuarioExiste = yield usuario_1.default.findByPk(id);
    if (!usuarioExiste) {
        return res.status(400).json({
            mgs: "No existe el usuario con el id: " + id
        });
    }
    ;
    yield usuarioExiste.update({ estado: false });
    //eliminacion fisica
    //await usuarioExiste?.destroy();
    res.json({
        msg: 'El usuario con el id :' + id + " ha sido eliminado",
        usuarioEliminado: usuarioExiste,
        usuarioAuthenticado: usuarioAuthenticado
    });
});
exports.deleteUsuario = deleteUsuario;
//# sourceMappingURL=usuarios.js.map