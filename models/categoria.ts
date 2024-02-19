import { DataTypes, Sequelize } from "sequelize";
import db from "../db/connection";
import Usuario from "./usuario";

const Categoria = db.define('Categoria', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  userCreated:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Usuario,
        key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Categoria.belongsTo(Usuario, { foreignKey: 'userCreated', as: 'usuario' });

(async () => {
    try {
      await Categoria.sync();
      console.log('Modelo Categoria sincronizado correctamente');
    } catch (error) {
      console.error('Error al sincronizar el modelo Categoria:', error);
    }
  })();

export default Categoria;