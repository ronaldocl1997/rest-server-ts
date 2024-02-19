
import { Request, Response } from "express";
import * as fs from 'fs';
import * as path from 'path';
import multer from 'multer';

export const postCarpeta = async( req: Request, res: Response) =>{

    console.log("crear carpetas");

    try {
        const { ruta, nombreCarpeta } = req.body;
        if (!ruta || !nombreCarpeta) {
            return res.status(400).json({ error: 'Se requiere la ruta y el nombre de la carpeta.' });
        };
    
        const carpetaPath = path.join(ruta, nombreCarpeta);
    
        if (fs.existsSync(carpetaPath)) {
            return res.status(400).json({ error: 'La carpeta ya existe.' });
        };
    
        fs.mkdirSync(carpetaPath);
    
        res.status(201).json({ mensaje: `Carpeta "${nombreCarpeta}" creada exitosamente en ${ruta}.` });
    
    } catch (error) {
        res.status(404).json({
            msg: `Error al crear la carpeta:${error}`
        })
    }

};

// Función para obtener la ruta del formulario
const obtenerRuta = (req: Request): string | undefined => {
    const ruta = req.body.ruta;
    return ruta;
};

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb:any) => {
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


export const subirImagen = async (req: Request, res: Response) => {
    try {
        // Procesar la carga de la imagen
        const upload = multer({ storage: storage });
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
    } catch (error) {
        res.status(500).json({
            msg: `Error al subir la imagen: ${error}`
        });
    }
};

export const deleteCarpeta = async ( req: Request, res: Response) =>{

    const { id } = req.params;
    const { body } = req;

    res.json({
        msg : 'El rol con el id :' + id + " ha sido eliminado",
        body,
    })
};

