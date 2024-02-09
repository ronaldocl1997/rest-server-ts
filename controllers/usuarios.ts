
import { Request, Response } from "express"
import Usuario from "../models/usuario";
import bcryptjs from "bcryptjs";

export const getUsuarios = async ( req: Request, res: Response) =>{

    const { size = 5, page = 1} = req.query;
    const offset:number = (parseInt(page as string) - 1) * parseInt(size as string);
    const usuarios = await Usuario.findAndCountAll({
        limit : parseInt(size as string),
        offset: offset,
        order: [["id","DESC"]],
        where: {
            estado: true
        }
    });

    res.json(usuarios);
};

export const getUsuario = async( req: Request, res: Response) =>{

    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if(usuario){
        res.json(usuario);
    }else{
        res.status(404).json({
            msg: `No existe un usuario con el id ${id}`
        })
    }
};

export const postUsuario = async( req: Request, res: Response) =>{

    let { nombre, correo, password, role } = req.body;

    try {

        //encriptar contrasena
        const salt = bcryptjs.genSaltSync();
        password = bcryptjs.hashSync(password, salt);


        //construir el modelo de usuario
        const usuario = Usuario.build({nombre,correo,password,role});

        console.log("usuario:", usuario)
        //guarda usuario en la bd
        await usuario.save();

        res.json({
            usuario
        });

    } catch (error) {
        
        res.status(500).json({
            msg : 'hable con el administrador',
            error: error
        })
    }
};


export const putUsuario = async ( req: Request, res: Response) =>{

    const { id } = req.params;
    let { google , ...resto } = req.body;

    try {

        if(resto.password){
            //encriptar contrasena
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(resto.password, salt);
        };

        const usuario = await Usuario.findByPk(id);

        console.log(usuario)
        if(!usuario){
            return res.status(400).json({
                msg: "No existe el usuario con el id: " + id
            });
        }

        await usuario?.update(resto);

        res.json({
            msg : 'Put Usuario',
            usuario
        })
    } catch (error) {
        res.status(500).json({
            msg : 'hable con el administrador',
            error: error
        })
    }
};

export const deleteUsuario = async ( req: Request, res: Response) =>{

    const { id } = req.params;
    const { body } = req;
    const usuarioAuthenticado = req.app.locals;

    const usuarioExiste = await Usuario.findByPk(id);

    if(!usuarioExiste){
        return res.status(400).json({
            mgs: "No existe el usuario con el id: " + id
        })
    };

    await usuarioExiste.update({ estado: false})

    //eliminacion fisica
    //await usuarioExiste?.destroy();

    res.json({
        msg : 'El usuario con el id :' + id + " ha sido eliminado",
        usuarioEliminado: usuarioExiste,
        usuarioAuthenticado:usuarioAuthenticado
    })
};

