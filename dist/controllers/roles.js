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
exports.deleteRole = exports.putRole = exports.postRole = exports.getRole = exports.getRoles = void 0;
const role_1 = __importDefault(require("../models/role"));
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield role_1.default.findAll();
    res.json(roles);
});
exports.getRoles = getRoles;
const getRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const role = yield role_1.default.findByPk(id);
    if (role) {
        res.json(role);
    }
    else {
        res.status(404).json({
            msg: `No existe el rol con el id ${id}`
        });
    }
});
exports.getRole = getRole;
const postRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { rol } = req.body;
    try {
        //verificar si el rol existe
        const existeRol = yield role_1.default.findOne({
            where: {
                rol: rol
            }
        });
        if (existeRol) {
            return res.status(400).json({
                msg: "Ya existe un rol con ese nombre: " + rol
            });
        }
        ;
        //construir el modelo de Rol
        const rolNew = role_1.default.build({ rol });
        //guarda rol en la bd
        yield rolNew.save();
        res.json(rolNew);
    }
    catch (error) {
        res.status(500).json({
            msg: 'hable con el administrador',
            error: error
        });
    }
});
exports.postRole = postRole;
const putRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    try {
        const rol = yield role_1.default.findByPk(id);
        if (!rol) {
            return res.status(400).json({
                msg: "No existe el rol con el id: " + id
            });
        }
        yield (rol === null || rol === void 0 ? void 0 : rol.update(body));
        res.json({
            msg: 'Put Rol',
            body
        });
    }
    catch (error) {
    }
});
exports.putRole = putRole;
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    const rolExiste = yield role_1.default.findByPk(id);
    if (!rolExiste) {
        return res.status(400).json({
            mgs: "No existe el rol con el id: " + id
        });
    }
    ;
    yield rolExiste.update({ estado: false });
    res.json({
        msg: 'El rol con el id :' + id + " ha sido eliminado",
        body,
    });
});
exports.deleteRole = deleteRole;
//# sourceMappingURL=roles.js.map