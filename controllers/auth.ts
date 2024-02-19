import { Request, Response } from "express"
import Usuario from '../models/usuario';
import bcryptjs from 'bcryptjs';
import { generarJWT } from "../helpers/generar-jwt";
import { GoogleSignInPayload, googleVerify } from "../helpers/google-verify";


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

export const goggleSingIn = async( req:Request, res:Response) =>{
    const {id_token} = req.body;

  /*   try { */

        const googleUser:GoogleSignInPayload | any = await googleVerify(id_token);

        let usuario = await Usuario.findOne({
            where:{
                correo: googleUser.email
            }
        });

        console.log('usuario en google sing',usuario);

        if( !usuario ){
            //tengo que crearlo

            const data = {
                nombre: googleUser.name,
                correo: googleUser.email,
                password: 'pass123',
                img: googleUser.picture,
                google: true,
                role:"ADMIN_ROLE"
            };

             //construir el modelo de usuario
            const usuario = Usuario.build(data);

            console.log("usuario:", usuario)
            //guarda usuario en la bd
            await usuario.save();
        };

        // si el usuario en bd esta activo
        console.log('estado :', usuario?.get('estado'));
        if( !usuario?.get('estado')){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        };

        //generar jwt
        const token = await generarJWT(usuario.get('id') as string);

        res.json({
            usuario,
            token
        })
/*     } catch (error) {
        res.status(400).json({
            msg: 'El token no se pudo verificar'
        })
    } */
}