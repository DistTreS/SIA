import { Sequelize } from "sequelize";

const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_NAME = "sia_sman",
  DB_USER = "root",
  DB_PASSWORD = "",
  DB_LOGGING = "false",
} = process.env;

const logging = DB_LOGGING === "true" ? console.log : false;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "mysql",
  logging,
  timezone: "+07:00",
});

export default sequelize;
