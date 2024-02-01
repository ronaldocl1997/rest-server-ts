
import { Request, Response } from "express"
import Usuario from "../models/usuario";

export const getUsuarios = async ( req: Request, res: Response) =>{

    const usuarios = await Usuario.findAll();
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

    const { body } = req;

    try {

        const existeEmail = await Usuario.findOne({
            where : {
                email: body.email
            }
        });

        if(existeEmail){
            return res.status(400).json({
                msg: "Ya existe un usuario con el email" + body.email
            })
        };

        const usuario = Usuario.build(body);
        await usuario.save();

        res.json(usuario);

    } catch (error) {
        res.status(500).json({
            msg : 'hable con el administrador',
        })
    }
};


export const putUsuario = async ( req: Request, res: Response) =>{

    const { id } = req.params;
    const { body } = req;

    try {

        const usuario = await Usuario.findByPk(id);

        console.log(usuario)
        if(!usuario){
            return res.status(400).json({
                msg: "No existe el usuario con el id: " + id
            });
        }

        await usuario?.update(body);

        res.json({
            msg : 'Put Usuario',
            body
        })
    } catch (error) {
        
    }
};

export const deleteUsuario = async ( req: Request, res: Response) =>{

    const { id } = req.params;
    const { body } = req;

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
        body,
    })
};

