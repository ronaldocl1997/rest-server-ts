"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contenedor_azure_1 = require("../controllers/contenedor-azure");
const router = (0, express_1.Router)();
router.get('/', contenedor_azure_1.listarContenedores);
router.get('/datos-contenedor', contenedor_azure_1.getDatosContenedor);
router.post('/subir-archivos', [], contenedor_azure_1.crearBlob);
router.post('/', []);
router.post('/enviar-datos', contenedor_azure_1.enviarDatos);
router.delete('/eliminar-archivo', [], contenedor_azure_1.eliminarBlob);
exports.default = router;
//# sourceMappingURL=contenedor-azure.js.map