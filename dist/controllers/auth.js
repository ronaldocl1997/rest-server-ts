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
exports.goggleSingIn = exports.login = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generar_jwt_1 = require("../helpers/generar-jwt");
const google_verify_1 = require("../helpers/google-verify");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, correo } = req.body;
    try {
        //verificar si el email existe
        const usuario = yield usuario_1.default.findOne({
            where: {
                correo
            },
        });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / passord no son correctos - correo'
            });
        }
        //si el usuario esta activo
        if (!usuario.get('estado')) {
            return res.status(400).json({
                msg: 'Usuario / passord no son correctos - estado:false'
            });
        }
        //verificar contrasena
        const validPass = bcryptjs_1.default.compareSync(password, usuario.get('password'));
        if (!validPass) {
            return res.status(400).json({
                msg: 'Usuario / passord no son correctos - password'
            });
        }
        //generar el jwt
        const token = yield (0, generar_jwt_1.generarJWT)(usuario.get('id'));
        res.json({
            mgs: 'Login ok',
            token
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'hable con el administrador',
            error: error
        });
    }
});
exports.login = login;
const goggleSingIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_token } = req.body;
    /*   try { */
    const googleUser = yield (0, google_verify_1.googleVerify)(id_token);
    let usuario = yield usuario_1.default.findOne({
        where: {
            correo: googleUser.email
        }
    });
    console.log('usuario en google sing', usuario);
    if (!usuario) {
        //tengo que crearlo
        const data = {
            nombre: googleUser.name,
            correo: googleUser.email,
            password: 'pass123',
            img: googleUser.picture,
            google: true,
            role: "ADMIN_ROLE"
        };
        //construir el modelo de usuario
        const usuario = usuario_1.default.build(data);
        console.log("usuario:", usuario);
        //guarda usuario en la bd
        yield usuario.save();
    }
    ;
    // si el usuario en bd esta activo
    console.log('estado :', usuario === null || usuario === void 0 ? void 0 : usuario.get('estado'));
    if (!(usuario === null || usuario === void 0 ? void 0 : usuario.get('estado'))) {
        return res.status(401).json({
            msg: 'Hable con el administrador, usuario bloqueado'
        });
    }
    ;
    //generar jwt
    const token = yield (0, generar_jwt_1.generarJWT)(usuario.get('id'));
    res.json({
        usuario,
        token
    });
    /*     } catch (error) {
            res.status(400).json({
                msg: 'El token no se pudo verificar'
            })
        } */
});
exports.goggleSingIn = goggleSingIn;
//# sourceMappingURL=auth.js.map