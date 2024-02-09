import { Router } from 'express'
import { check } from 'express-validator';
import validarCampos from '../middlewares/validar-campos';
import { deleteRole, getRole, getRoles, postRole, putRole } from '../controllers/roles';


const router = Router();


router.get('/',     getRoles);

router.get('/:id',  getRole);

router.post('/',[
    check('rol','El nombrel del rol es obligatorio').not().isEmpty(),
    validarCampos
],postRole);

router.put('/:id',  putRole);

router.delete('/:id',  deleteRole);

export default router;