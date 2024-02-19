import { Locals, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Usuario from '../models/usuario';

interface MyJwtPayload extends JwtPayload {
    uid: string;
};



const validarJWT = async (req: Request, res: Response, next:()=>void) =>{

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

     try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY as string) as MyJwtPayload;

       const usuario = await Usuario.findByPk(uid);

       if(!usuario){
        return res.status(401).json({
            msg: 'Token no valido, Usuario no existe en la bd'
        })
       }

       //verificar si el usuario no esta eliminado , estado= true
       if(!usuario?.get('estado')){
        return res.status(401).json({
            msg: 'Token no valido, Usuario con estado:false'
        })
       }

       req.app.locals = usuario as Record<string,any> & Locals;
       console.log('usuario del token:',req.app.locals);
        next();
     } catch (error) {
        return res.status(401).json({
            msg: 'Token no valido',
        })
     }
}


export {
    validarJWT
}