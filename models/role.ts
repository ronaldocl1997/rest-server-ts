import { DataTypes } from "sequelize";
import sequelize from "sequelize";
import db from "../db/connection";

const Role = db.define('Role', {
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
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

Role.sync();

export default Role;