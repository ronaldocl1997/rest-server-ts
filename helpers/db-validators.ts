import Role from "../models/role";
import Usuario from "../models/usuario";


const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne(
        {
            where: {
                rol
            }
        }
    );

    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }
};

const emailExiste = async (email = '') =>{
    const existe = await Usuario.findOne({
        where : {
            correo: email
        }
    });
    if(existe){
        throw new Error(`El Correo ${email} ya esta registrado`);
    };
};

export {esRolValido, emailExiste};