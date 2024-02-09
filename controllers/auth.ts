import { Request, Response } from "express"
import Usuario from '../models/usuario';
import bcryptjs from 'bcryptjs';
import { generarJWT } from "../helpers/generar-jwt";


export const login = async( req: Request, res: Response) =>{

    const {password, correo} = req.body;

    try {
        

        //verificar si el email existe
        const usuario = await Usuario.findOne({
            where : {
                correo
            },
        });
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / passord no son correctos - correo'
            })
        }
        //si el usuario esta activo
        if( !usuario.get('estado')){
            return res.status(400).json({
                msg: 'Usuario / passord no son correctos - estado:false'
            })
        }
        //verificar contrasena
        const validPass: boolean = bcryptjs.compareSync(password, usuario.get('password') as string);
        if(!validPass){
            return res.status(400).json({
                msg: 'Usuario / passord no son correctos - password'
            })
        }
        //generar el jwt
        const token = await generarJWT(usuario.get('id') as string);
        res.json({
            mgs: 'Login ok',
            token
        })

    } catch (error) {
        res.status(500).json({
            msg : 'hable con el administrador',
            error: error
        })
    }
};