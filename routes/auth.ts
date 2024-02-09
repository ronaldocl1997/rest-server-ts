import { Router } from 'express'
import { check } from 'express-validator';
import { goggleSingIn, login } from '../controllers/auth';
import validarCampos from '../middlewares/validar-campos';

const router = Router();


router.get('/',     );

router.get('/:id',  );

router.post('/login',[
    check('correo','El correo no es valido').isEmail(),
    check('password', 'La contrasena es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google',[
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos
], goggleSingIn);

router.put('/:id',  );

router.delete('/:id',  );

export default router;