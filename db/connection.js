import { Sequelize } from "sequelize";
import "dotenv/config";

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

export default sequelize;
