const { Sequelize, DataTypes  } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    dialectOptions: {},
    logging: false,
  }
);


module.exports = {sequelize, DataTypes};
