import { Sequelize } from 'sequelize';

const db = new Sequelize('db_penggajian3', 'root', 'KDWheaven', {
    host: "localhost",
    dialect: "mysql"
});

export default db;