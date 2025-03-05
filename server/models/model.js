const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");

const Data = sequelize.define(
  "data",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  {
    tableName: "data",
    timestamps: true,
  }
);

module.exports = {
  Data,
};
