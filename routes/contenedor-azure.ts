import { Router } from 'express'
import { crearBlob, eliminarBlob, enviarDatos, getDatosContenedor, listarContenedores } from '../controllers/contenedor-azure';




const router = Router();


router.get('/',listarContenedores);

router.get('/datos-contenedor',getDatosContenedor);

router.post('/subir-archivos',[
],crearBlob);

router.post('/',[
],);

router.post('/enviar-datos',enviarDatos);

router.delete('/eliminar-archivo',[
],eliminarBlob);


export default router;