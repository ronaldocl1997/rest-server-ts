"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const router = (0, express_1.Router)();
router.get('/');
router.get('/:id');
router.post('/login', [
    (0, express_validator_1.check)('correo', 'El correo no es valido').isEmail(),
    (0, express_validator_1.check)('password', 'La contrasena es obligatoria').not().isEmpty(),
    validar_campos_1.default
], auth_1.login);
router.post('/google', [
    (0, express_validator_1.check)('id_token', 'id_token es necesario').not().isEmpty(),
    validar_campos_1.default
], auth_1.goggleSingIn);
router.put('/:id');
router.delete('/:id');
exports.default = router;
//# sourceMappingURL=auth.js.map