import { Sequelize } from "sequelize";


const db = new Sequelize('node', 'root', '15dejulio', {
    host: 'localhost',
    dialect: 'mysql',
    //logging: false,
});

export default db;