import { Request, Response } from "express"
import Categoria from "../models/categoria";


export const postCategoria = async( req: Request, res: Response) =>{

/*     try { */

        const nombre = req.body.nombre.toUpperCase();

        const categoriaDB:any = await Categoria.findOne({
            where: {
                nombre: nombre
            }
        });

        console.log("categoria en bd:", categoriaDB)
    
        if( categoriaDB ){
            console.log("entro a if categoria")
            return res.status(400).json({
                msg: `La categoria ${categoriaDB.nombre}. ya existe`
            })
        };
    
        const usuarioAuthenticado = req.app.locals;
    
        const data = {
            nombre,
            userCreated: usuarioAuthenticado.id
        };
    
        //construir el modelo de categoria
        const categoria = Categoria.build(data);
    
        await categoria.save();
    
        res.status(201).json({
            categoria
        });
       
/*     } catch (error) {
        
        res.status(500).json({
            msg : 'hable con el administrador',
            error: error
        })
    } */
};