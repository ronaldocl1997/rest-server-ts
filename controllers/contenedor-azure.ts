
import {BlobServiceClient, BlockBlobClient} from "@azure/storage-blob";
import { Request, Response } from "express";
import multer from 'multer';
import PDFDocument from 'pdfkit';
import { PassThrough } from "stream";
import axios from "axios";

export const listarContenedores = async (req: Request, res: Response) => {
    try {
        const blobService = BlobServiceClient.fromConnectionString(
            process.env.CONNECTION_STRING_AZURE?.toString()!
        );

        // Obtener la lista de contenedores
        const containers = [];
        let i = 1;
        for await (const container of blobService.listContainers()) {
            // Obtener la lista de blobs (archivos) en cada contenedor
            const containerClient = blobService.getContainerClient(container.name);
            console.log("name:",container.name)
            const blobs = [];
            for await (const blob of containerClient.listBlobsFlat()) {
                blobs.push(blob.name);
            }

            // Agregar la información del contenedor y sus blobs a la lista
            containers.push({
                id: i++,
                name: container.name,
                blobs: blobs,
            });
        }

        res.status(200).json({
            msg: "Contenedores listados",
            containers: containers,
        });
    } catch (error) {
        console.error('Error al listar contenedores:', error);
        res.status(500).json({
            error: 'Error al listar contenedores',
        });
    }
};

export const getDatosContenedor = async (req: Request, res: Response) => {
    
    try {

        const nombreCarpeta: string = req.body.nombreCarpeta || ''; // Get the folder name from the request body
        if(!nombreCarpeta){
            return res.status(500).json({
                error: 'El nombre de la carpeta es obligatorio',
            });
        }

        const blobService = BlobServiceClient.fromConnectionString(
            process.env.CONNECTION_STRING_AZURE?.toString()!
        );

        const containerClient = blobService.getContainerClient(process.env.CONTAINER_NAME!.toString());
        const blobs = [];

        const carpetaExiste = containerClient.listBlobsByHierarchy('/',{prefix: nombreCarpeta.toUpperCase()});
        const result = await carpetaExiste.next();
        console.log('carpeta existe:',result.value);

        if (result.value) {
            // Si hay algún resultado, la carpeta existe
            console.log('La carpeta existe:', nombreCarpeta);

            // Resto del código para listar los blobs o realizar otras operaciones
        } else {
            // Si no hay resultado, la carpeta no existe
            console.log('La carpeta no existe:', nombreCarpeta);
            return res.status(404).json({
                error: 'La carpeta especificada no existe',
            });
        };

        const test = await containerClient.listBlobsFlat({ prefix: nombreCarpeta.toUpperCase() });
        let blobResult = await test.next();
        console.log("test:", blobResult);
        while (!blobResult.done) {
            const blob = blobResult.value;
            console.log("Nombre del blob:", blob.name);
            const tempBlockBlobClient: any = containerClient.getBlockBlobClient(blob.name);
            blobs.push({
                cuenta: tempBlockBlobClient?.accountName,
                url: tempBlockBlobClient?.url,
                nombreArchivo: tempBlockBlobClient?._name,
                NombreContenedor: tempBlockBlobClient?._containerName,
            });
            blobResult = await test.next();
        }

        // Crear un documento PDF
        const pdfDoc = new PDFDocument();
        
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
        const pdfStream = new PassThrough();
        pdfDoc.pipe(pdfStream);
        pdfDoc.end();

        // Enviar el stream del PDF como respuesta
        pdfStream.pipe(res);

    } catch (error) {
        console.error('Error al listar contenedores:', error);
        res.status(500).json({
            error: 'Error al listar contenedores',
        });
    }
};

export const crearBlob = async (req: Request, res: Response) => {
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage }).single('imagen');

    try {
        upload(req, res, async (err: any) => {
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

            if(!nombreCarpeta){
                return res.status(400).json({
                    error: 'El nombre de la carpeta es obligatorio'
                });
            }

            console.log('carpeta=',nombreCarpeta)

            const blobService = await BlobServiceClient.fromConnectionString(
                process.env.CONNECTION_STRING_AZURE!.toString()
            );

            const containerClient = await blobService.getContainerClient(
                process.env.CONTAINER_NAME!.toString()
            );

            const blobName = `${nombreCarpeta.toString().toUpperCase()}//${req.file.originalname}`;
            const nombreArchivoSanitizado = blobName.replace(/^\uFEFF/, '').replace(/\\/g, '/');
            const blockBlobClient = containerClient.getBlockBlobClient(nombreArchivoSanitizado.toString());

            //validar que el blob no exista
            const blobExists = await blockBlobClient.exists();
            if (blobExists) {
                return res.status(400).json({ error: 'Ya existe un archivo con ese nombre.' });
            }

            const imageData = req.file.buffer;
            const uploadBlobResponse = await blockBlobClient.upload(imageData, imageData.length);

            return res.status(200).json({
                msg: 'Imagen subida exitosamente',
                archivo: blobName
            });
        });
    } catch (error:any) {
        return res.status(500).json({
            error: 'Error interno del servidor: ' + error.message
        });
    }
};

export const eliminarBlob = async (req: Request, res: Response) => {
    try {
        const nombre: string = req.body.nombre;
        console.log("nombre", nombre);

        const blobService = await BlobServiceClient.fromConnectionString(
            process.env.CONNECTION_STRING_AZURE!.toString()
        );

        const containerClient = await blobService.getContainerClient(
            process.env.CONTAINER_NAME!.toString()
        );

        const blockBlobClient = containerClient.getBlockBlobClient(nombre);

        // ver que exista el archivo
        const blobExists = await blockBlobClient.exists();

        if (!blobExists) {
            return res.status(404).json({ error: `No existe archivo con el nombre ${nombre}.` });
        };

        const resultado = await blockBlobClient.delete();

        console.log(`Blob eliminado con éxito. Resultado:`, resultado);

        return res.status(200).json({
            msg: 'Imagen eliminada',
            blobInfo: nombre
        });
    } catch (error:any) {
        console.error('Error al intentar eliminar el blob:', error);
        return res.status(500).json({ error: error.message });
    }
};


export const enviarDatos = async (req: Request, res: Response) =>{

    let { weebhook, carpeta, nombreArchivo } = req.body;

    if(!weebhook || !carpeta || !nombreArchivo){
        return res.status(400).json({
            msg: 'El weebhook, la carpeta y nombreArchivo son obligatorios'
        })
    };

    const blobService = BlobServiceClient.fromConnectionString(
        process.env.CONNECTION_STRING_AZURE?.toString()!
    );

    const containerClient = blobService.getContainerClient(process.env.CONTAINER_NAME!.toString());
    const blobs = [];

    const carpetaExiste = containerClient.listBlobsByHierarchy('/',{prefix: carpeta.toUpperCase()});
    const result = await carpetaExiste.next();
    console.log('carpeta existe:',result.value);

    if (result.value) {
        // Si hay algún resultado, la carpeta existe
        console.log('La carpeta existe:', carpeta);

        // Resto del código para listar los blobs o realizar otras operaciones
    } else {
        // Si no hay resultado, la carpeta no existe
        console.log('La carpeta no existe:', carpeta);
        return res.status(404).json({
            error: 'La carpeta especificada no existe',
        });
    };

    const test = await containerClient.listBlobsFlat({ prefix: carpeta.toUpperCase() });
    let blobResult = await test.next();

    while (!blobResult.done) {
        const blob = blobResult.value;
        console.log("Nombre del blob:", blob.name);
        const tempBlockBlobClient: any = containerClient.getBlockBlobClient(blob.name);
        let nombreArchivo = tempBlockBlobClient?._name.split("/")[1];
        if(nombreArchivo === '' || !nombreArchivo){
            console.log('es carpeta')
        }else{
            blobs.push({
                nombreArchivo: nombreArchivo,
                url: tempBlockBlobClient?.url,
            });
        }
        blobResult = await test.next();
    }


    const nombre: string = nombreArchivo;

    const params = {
        designName: nombre,
        archivos: blobs
    };

    axios.post(weebhook, params)
    .then(response => {
        res.status(200).json({
            msg: 'ok',
            archivos: params
        })
    })
    .catch(error => {
        res.status(500).json({
            msg: 'error'
        })
    });
      
}



