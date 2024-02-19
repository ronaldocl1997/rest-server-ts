import { Router } from 'express'
import { check } from 'express-validator';
import validarCampos from '../middlewares/validar-campos';
import { validarJWT } from '../middlewares/validar-jwt';
import { postCategoria } from '../controllers/categorias';

const router = Router();

//obetener todas las categorias-publico
router.get('/', (req,res)=>{
    res.json('get')
});

//obtener una categoria especifica
router.get('/:id', (req,res)=>{
    res.json('get')
});

//crear categoria- privado con cuanquier persona con token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],postCategoria);

//actualizar categoria- privado con cuanquier persona con token valido
router.put('/:id', (req,res)=>{
    res.json('put')
});

//eliminar  categoria- privado con cuanquier persona con token valido
router.delete('/:id', (req,res)=>{
    res.json('delete')
});



export default router;