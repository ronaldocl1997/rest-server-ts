"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const validar_jwt_1 = require("../middlewares/validar-jwt");
const categorias_1 = require("../controllers/categorias");
const router = (0, express_1.Router)();
//obetener todas las categorias-publico
router.get('/', (req, res) => {
    res.json('get');
});
//obtener una categoria especifica
router.get('/:id', (req, res) => {
    res.json('get');
});
//crear categoria- privado con cuanquier persona con token valido
router.post('/', [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validar_campos_1.default
], categorias_1.postCategoria);
//actualizar categoria- privado con cuanquier persona con token valido
router.put('/:id', (req, res) => {
    res.json('put');
});
//eliminar  categoria- privado con cuanquier persona con token valido
router.delete('/:id', (req, res) => {
    res.json('delete');
});
exports.default = router;
//# sourceMappingURL=categorias.js.map