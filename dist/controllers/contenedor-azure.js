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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarDatos = exports.eliminarBlob = exports.crearBlob = exports.getDatosContenedor = exports.listarContenedores = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const multer_1 = __importDefault(require("multer"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const stream_1 = require("stream");
const axios_1 = __importDefault(require("axios"));
const listarContenedores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    var _g;
    try {
        const blobService = storage_blob_1.BlobServiceClient.fromConnectionString((_g = process.env.CONNECTION_STRING_AZURE) === null || _g === void 0 ? void 0 : _g.toString());
        // Obtener la lista de contenedores
        const containers = [];
        let i = 1;
        try {
            for (var _h = true, _j = __asyncValues(blobService.listContainers()), _k; _k = yield _j.next(), _a = _k.done, !_a; _h = true) {
                _c = _k.value;
                _h = false;
                const container = _c;
                // Obtener la lista de blobs (archivos) en cada contenedor
                const containerClient = blobService.getContainerClient(container.name);
                console.log("name:", container.name);
                const blobs = [];
                try {
                    for (var _l = true, _m = (e_2 = void 0, __asyncValues(containerClient.listBlobsFlat())), _o; _o = yield _m.next(), _d = _o.done, !_d; _l = true) {
                        _f = _o.value;
                        _l = false;
                        const blob = _f;
                        blobs.push(blob.name);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_l && !_d && (_e = _m.return)) yield _e.call(_m);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                // Agregar la información del contenedor y sus blobs a la lista
                containers.push({
                    id: i++,
                    name: container.name,
                    blobs: blobs,
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_h && !_a && (_b = _j.return)) yield _b.call(_j);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.status(200).json({
            msg: "Contenedores listados",
            containers: containers,
        });
    }
    catch (error) {
        console.error('Error al listar contenedores:', error);
        res.status(500).json({
            error: 'Error al listar contenedores',
        });
    }
});
exports.listarContenedores = listarContenedores;
const getDatosContenedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _p;
    try {
        const nombreCarpeta = req.body.nombreCarpeta || ''; // Get the folder name from the request body
        if (!nombreCarpeta) {
            return res.status(500).json({
                error: 'El nombre de la carpeta es obligatorio',
            });
        }
        const blobService = storage_blob_1.BlobServiceClient.fromConnectionString((_p = process.env.CONNECTION_STRING_AZURE) === null || _p === void 0 ? void 0 : _p.toString());
        const containerClient = blobService.getContainerClient(process.env.CONTAINER_NAME.toString());
        const blobs = [];
        const carpetaExiste = containerClient.listBlobsByHierarchy('/', { prefix: nombreCarpeta.toUpperCase() });
        const result = yield carpetaExiste.next();
        console.log('carpeta existe:', result.value);
        if (result.value) {
            // Si hay algún resultado, la carpeta existe
            console.log('La carpeta existe:', nombreCarpeta);
            // Resto del código para listar los blobs o realizar otras operaciones
        }
        else {
            // Si no hay resultado, la carpeta no existe
            console.log('La carpeta no existe:', nombreCarpeta);
            return res.status(404).json({
                error: 'La carpeta especificada no existe',
            });
        }
        ;
        const test = yield containerClient.listBlobsFlat({ prefix: nombreCarpeta.toUpperCase() });
        let blobResult = yield test.next();
        console.log("test:", blobResult);
        while (!blobResult.done) {
            const blob = blobResult.value;
            console.log("Nombre del blob:", blob.name);
            const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);
            blobs.push({
                cuenta: tempBlockBlobClient === null || tempBlockBlobClient === void 0 ? void 0 : tempBlockBlobClient.accountName,
                url: tempBlockBlobClient === null || tempBlockBlobClient === void 0 ? void 0 : tempBlockBlobClient.url,
                nombreArchivo: tempBlockBlobClient === null || tempBlockBlobClient === void 0 ? void 0 : tempBlockBlobClient._name,
                NombreContenedor: tempBlockBlobClient === null || tempBlockBlobClient === void 0 ? void 0 : tempBlockBlobClient._containerName,
            });
            blobResult = yield test.next();
        }
        // Crear un documento PDF
        const pdfDoc = new pdfkit_1.default();
        pdfDoc.text('Listado de archivos:');
        pdfDoc.moveDown();
        blobs.forEach((blob) => {
            pdfDoc.text(`Cuenta: ${blob.cuenta}`);
            pdfDoc.text(`URL: ${blob.url}`);
            pdfDoc.text(`Nombre de Archivo: ${blob.nombreArchivo}`);
            pdfDoc.text(`Nombre de Contenedor: ${blob.NombreContenedor}`);
            pdfDoc.moveDown();
        });
        // Configurar encabezados HTTP para la descarga del PDF
        res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        // Crear un stream de lectura del documento PDF
        const pdfStream = new stream_1.PassThrough();
        pdfDoc.pipe(pdfStream);
        pdfDoc.end();
        // Enviar el stream del PDF como respuesta
        pdfStream.pipe(res);
    }
    catch (error) {
        console.error('Error al listar contenedores:', error);
        res.status(500).json({
            error: 'Error al listar contenedores',
        });
    }
});
exports.getDatosContenedor = getDatosContenedor;
const crearBlob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storage = multer_1.default.memoryStorage();
    const upload = (0, multer_1.default)({ storage: storage }).single('imagen');
    try {
        upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(500).json({
                    error: 'Error al subir el archivo: ' + err.message
                });
            }
            if (!req.file) {
                return res.status(400).json({
                    error: 'No se proporcionó ningún archivo'
                });
            }
            const nombreCarpeta = req.body.carpeta;
            if (!nombreCarpeta) {
                return res.status(400).json({
                    error: 'El nombre de la carpeta es obligatorio'
                });
            }
            console.log('carpeta=', nombreCarpeta);
            const blobService = yield storage_blob_1.BlobServiceClient.fromConnectionString(process.env.CONNECTION_STRING_AZURE.toString());
            const containerClient = yield blobService.getContainerClient(process.env.CONTAINER_NAME.toString());
            const blobName = `${nombreCarpeta.toString().toUpperCase()}//${req.file.originalname}`;
            const nombreArchivoSanitizado = blobName.replace(/^\uFEFF/, '').replace(/\\/g, '/');
            const blockBlobClient = containerClient.getBlockBlobClient(nombreArchivoSanitizado.toString());
            //validar que el blob no exista
            const blobExists = yield blockBlobClient.exists();
            if (blobExists) {
                return res.status(400).json({ error: 'Ya existe un archivo con ese nombre.' });
            }
            const imageData = req.file.buffer;
            const uploadBlobResponse = yield blockBlobClient.upload(imageData, imageData.length);
            return res.status(200).json({
                msg: 'Imagen subida exitosamente',
                archivo: blobName
            });
        }));
    }
    catch (error) {
        return res.status(500).json({
            error: 'Error interno del servidor: ' + error.message
        });
    }
});
exports.crearBlob = crearBlob;
const eliminarBlob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nombre = req.body.nombre;
        console.log("nombre", nombre);
        const blobService = yield storage_blob_1.BlobServiceClient.fromConnectionString(process.env.CONNECTION_STRING_AZURE.toString());
        const containerClient = yield blobService.getContainerClient(process.env.CONTAINER_NAME.toString());
        const blockBlobClient = containerClient.getBlockBlobClient(nombre);
        // ver que exista el archivo
        const blobExists = yield blockBlobClient.exists();
        if (!blobExists) {
            return res.status(404).json({ error: `No existe archivo con el nombre ${nombre}.` });
        }
        ;
        const resultado = yield blockBlobClient.delete();
        console.log(`Blob eliminado con éxito. Resultado:`, resultado);
        return res.status(200).json({
            msg: 'Imagen eliminada',
            blobInfo: nombre
        });
    }
    catch (error) {
        console.error('Error al intentar eliminar el blob:', error);
        return res.status(500).json({ error: error.message });
    }
});
exports.eliminarBlob = eliminarBlob;
const enviarDatos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _q;
    let { weebhook, carpeta, nombreArchivo } = req.body;
    if (!weebhook || !carpeta || !nombreArchivo) {
        return res.status(400).json({
            msg: 'El weebhook, la carpeta y nombreArchivo son obligatorios'
        });
    }
    ;
    const blobService = storage_blob_1.BlobServiceClient.fromConnectionString((_q = process.env.CONNECTION_STRING_AZURE) === null || _q === void 0 ? void 0 : _q.toString());
    const containerClient = blobService.getContainerClient(process.env.CONTAINER_NAME.toString());
    const blobs = [];
    const carpetaExiste = containerClient.listBlobsByHierarchy('/', { prefix: carpeta.toUpperCase() });
    const result = yield carpetaExiste.next();
    console.log('carpeta existe:', result.value);
    if (result.value) {
        // Si hay algún resultado, la carpeta existe
        console.log('La carpeta existe:', carpeta);
        // Resto del código para listar los blobs o realizar otras operaciones
    }
    else {
        // Si no hay resultado, la carpeta no existe
        console.log('La carpeta no existe:', carpeta);
        return res.status(404).json({
            error: 'La carpeta especificada no existe',
        });
    }
    ;
    const test = yield containerClient.listBlobsFlat({ prefix: carpeta.toUpperCase() });
    let blobResult = yield test.next();
    while (!blobResult.done) {
        const blob = blobResult.value;
        console.log("Nombre del blob:", blob.name);
        const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);
        let nombreArchivo = tempBlockBlobClient === null || tempBlockBlobClient === void 0 ? void 0 : tempBlockBlobClient._name.split("/")[1];
        if (nombreArchivo === '' || !nombreArchivo) {
            console.log('es carpeta');
        }
        else {
            blobs.push({
                nombreArchivo: nombreArchivo,
                url: tempBlockBlobClient === null || tempBlockBlobClient === void 0 ? void 0 : tempBlockBlobClient.url,
            });
        }
        blobResult = yield test.next();
    }
    const nombre = nombreArchivo;
    const params = {
        designName: nombre,
        archivos: blobs
    };
    axios_1.default.post(weebhook, params)
        .then(response => {
        res.status(200).json({
            msg: 'ok',
            archivos: params
        });
    })
        .catch(error => {
        res.status(500).json({
            msg: 'error'
        });
    });
});
exports.enviarDatos = enviarDatos;
//# sourceMappingURL=contenedor-azure.js.map