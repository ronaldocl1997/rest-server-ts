
import { Request, Response } from "express"
import Role from "../models/role";

export const getRoles = async ( req: Request, res: Response) =>{

    const roles = await Role.findAll();
    res.json(roles);
};

export const getRole = async( req: Request, res: Response) =>{

    const { id } = req.params;

    const role = await Role.findByPk(id);

    if(role){
        res.json(role);
    }else{
        res.status(404).json({
            msg: `No existe el rol con el id ${id}`
        })
    }
};

export const postRole = async( req: Request, res: Response) =>{

    let { rol } = req.body;

    try {

        //verificar si el rol existe
        const existeRol = await Role.findOne({
            where : {
                rol: rol
            }
        });

        if(existeRol){
            return res.status(400).json({
                msg: "Ya existe un rol con ese nombre: " + rol
            })
        };


        //construir el modelo de Rol
        const rolNew = Role.build({rol});

        //guarda rol en la bd
        await rolNew.save();

        res.json(rolNew);

    } catch (error) {
        
        res.status(500).json({
            msg : 'hable con el administrador',
            error: error
        })
    }
};


export const putRole = async ( req: Request, res: Response) =>{

    const { id } = req.params;
    const { body } = req;

    try {

        const rol = await Role.findByPk(id);

        if(!rol){
            return res.status(400).json({
                msg: "No existe el rol con el id: " + id
            });
        }

        await rol?.update(body);

        res.json({
            msg : 'Put Rol',
            body
        })
    } catch (error) {
        
    }
};

export const deleteRole = async ( req: Request, res: Response) =>{

    const { id } = req.params;
    const { body } = req;

    const rolExiste = await Role.findByPk(id);

    if(!rolExiste){
        return res.status(400).json({
            mgs: "No existe el rol con el id: " + id
        })
    };

    await rolExiste.update({ estado: false})


    res.json({
        msg : 'El rol con el id :' + id + " ha sido eliminado",
        body,
    })
};

