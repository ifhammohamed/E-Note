"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Note extends Model {
    static associate() {
      // define association here
    }
  }
  Note.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      categories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: "Note",
    }
  );
  return Note;
};
