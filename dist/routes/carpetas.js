"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carpetas_1 = require("../controllers/carpetas");
const router = (0, express_1.Router)();
router.get('/');
router.post('/crear', [], carpetas_1.postCarpeta);
router.post('/subir-imagen', [], carpetas_1.subirImagen);
exports.default = router;
//# sourceMappingURL=carpetas.js.map