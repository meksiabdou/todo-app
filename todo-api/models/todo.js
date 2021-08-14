const { sequelize, DataTypes } = require("../database/connection");

const Todos = sequelize.define("Todos", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description : {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  users: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id : {
    type: DataTypes.UUID,
    allowNull: false,
  },
  content : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categories : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  active: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
});

module.exports = Todos;
