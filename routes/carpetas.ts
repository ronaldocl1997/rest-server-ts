import { Router } from 'express'
import { check } from 'express-validator';
import { postCarpeta, subirImagen } from '../controllers/carpetas';



const router = Router();


router.get('/',);

router.post('/crear',[
],postCarpeta);

router.post('/subir-imagen',[
],subirImagen);


export default router;