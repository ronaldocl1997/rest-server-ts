"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const roles_1 = require("../controllers/roles");
const router = (0, express_1.Router)();
router.get('/', roles_1.getRoles);
router.get('/:id', roles_1.getRole);
router.post('/', [
    (0, express_validator_1.check)('rol', 'El nombrel del rol es obligatorio').not().isEmpty(),
    validar_campos_1.default
], roles_1.postRole);
router.put('/:id', roles_1.putRole);
router.delete('/:id', roles_1.deleteRole);
exports.default = router;
//# sourceMappingURL=roles.js.map