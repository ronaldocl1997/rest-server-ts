"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarios_1 = require("../controllers/usuarios");
const express_validator_1 = require("express-validator");
const db_validators_1 = require("../helpers/db-validators");
const validar_jwt_1 = require("../middlewares/validar-jwt");
const validar_roles_1 = require("../middlewares/validar-roles");
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const router = (0, express_1.Router)();
router.get('/', usuarios_1.getUsuarios);
router.get('/:id', usuarios_1.getUsuario);
router.post('/', [
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('password', 'El password debe ser mas de 6 letras').isLength({ min: 6 }),
    (0, express_validator_1.check)('correo').custom(db_validators_1.emailExiste),
    //check('role','No es un rol valido').isIn(["ADMIN_ROLE","USER_ROLE"]),
    (0, express_validator_1.check)('role').custom(db_validators_1.esRolValido),
    validar_campos_1.default
], usuarios_1.postUsuario);
router.put('/:id', [
    (0, express_validator_1.check)('role').custom(db_validators_1.esRolValido),
    validar_campos_1.default
], usuarios_1.putUsuario);
router.delete('/:id', [
    validar_jwt_1.validarJWT,
    (0, validar_roles_1.tieneRole)('ADMIN_ROLE', 'ROLE_ADMIN')
    //esAdminRol
], usuarios_1.deleteUsuario);
exports.default = router;
//# sourceMappingURL=usuarios.js.map