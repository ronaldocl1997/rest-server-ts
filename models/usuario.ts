import { DataTypes } from "sequelize";
import sequelize from "sequelize";
import db from "../db/connection";

const Usuario = db.define('Usuario', {
    nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING,
  },
  role: {
    type: sequelize.ENUM("ADMIN_ROLE","ROLE_ADMIN",),
    allowNull: false,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  google: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.fn('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

//lee el json y retorna a como lo configures
Usuario.prototype.toJSON = function() {
  const { password, id, ...usuario} = this.get();

  //cambiar visulamente id por uuid en la bd se conserva igual
  usuario.uid = id;
  return usuario;
}

Usuario.sync();

export default Usuario;