import { Router } from 'express'
import { deleteUsuario, getUsuario, getUsuarios, postUsuario, putUsuario } from '../controllers/usuarios';
import { check } from 'express-validator';

import { emailExiste, esRolValido } from '../helpers/db-validators';

import { validarJWT } from '../middlewares/validar-jwt';
import { esAdminRol, tieneRole } from '../middlewares/validar-roles';
import validarCampos from '../middlewares/validar-campos';


const router = Router();


router.get('/',     getUsuarios);

router.get('/:id',  getUsuario);

router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password debe ser mas de 6 letras').isLength({min:6}),
    check('correo').custom(emailExiste),
    //check('role','No es un rol valido').isIn(["ADMIN_ROLE","USER_ROLE"]),
    check('role').custom(esRolValido),
    validarCampos
],postUsuario);

router.put('/:id', [
    check('role').custom(esRolValido),
    validarCampos
] ,putUsuario);

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE','ROLE_ADMIN')
    //esAdminRol
] ,deleteUsuario);

export default router;