"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteCarpeta = exports.subirImagen = exports.postCarpeta = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const multer_1 = __importDefault(require("multer"));
const postCarpeta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("crear carpetas");
    try {
        const { ruta, nombreCarpeta } = req.body;
        if (!ruta || !nombreCarpeta) {
            return res.status(400).json({ error: 'Se requiere la ruta y el nombre de la carpeta.' });
        }
        ;
        const carpetaPath = path.join(ruta, nombreCarpeta);
        if (fs.existsSync(carpetaPath)) {
            return res.status(400).json({ error: 'La carpeta ya existe.' });
        }
        ;
        fs.mkdirSync(carpetaPath);
        res.status(201).json({ mensaje: `Carpeta "${nombreCarpeta}" creada exitosamente en ${ruta}.` });
    }
    catch (error) {
        res.status(404).json({
            msg: `Error al crear la carpeta:${error}`
        });
    }
});
exports.postCarpeta = postCarpeta;
// Función para obtener la ruta del formulario
const obtenerRuta = (req) => {
    const ruta = req.body.ruta;
    return ruta;
};
// Configuración de almacenamiento
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Obtener la ruta del formulario
        const ruta = obtenerRuta(req);
        if (!ruta) {
            return cb(new Error('La ruta no fue proporcionada en el formulario.'));
        }
        // Crear la carpeta de imágenes si no existe
        cb(null, ruta);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const subirImagen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Procesar la carga de la imagen
        const upload = (0, multer_1.default)({ storage: storage });
        upload.single('imagen')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: `Error al subir la imagen: ${err.message}` });
            }
            // Obtener la ruta del formulario
            const ruta = obtenerRuta(req);
            console.log('Ruta:', ruta);
            res.status(201).json({
                mensaje: 'Imagen subida exitosamente.',
                ruta: ruta
            });
        });
    }
    catch (error) {
        res.status(500).json({
            msg: `Error al subir la imagen: ${error}`
        });
    }
});
exports.subirImagen = subirImagen;
const deleteCarpeta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    res.json({
        msg: 'El rol con el id :' + id + " ha sido eliminado",
        body,
    });
});
exports.deleteCarpeta = deleteCarpeta;
//# sourceMappingURL=carpetas.js.map