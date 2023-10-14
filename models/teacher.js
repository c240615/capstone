"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    
    static associate(models) {
      // 一位 user 只能登記成為 一位老師
      Teacher.belongsTo(models.User, { foreignKey: "userId" });
      // 一位老師可開多堂課
      Teacher.hasMany(models.Course, { foreignKey: "teacherId" });
    }
  }
  Teacher.init(
    {
      intro: DataTypes.TEXT,
      style: DataTypes.TEXT,
      link: DataTypes.TEXT,
      courseDuration: DataTypes.FLOAT,
      monday: DataTypes.BOOLEAN,
      tuesday: DataTypes.BOOLEAN,
      wednesday: DataTypes.BOOLEAN,
      thursday: DataTypes.BOOLEAN,
      friday: DataTypes.BOOLEAN,
      saturday: DataTypes.BOOLEAN,
      sunday: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      userId: DataTypes.INTEGER,      
    },
    {
      sequelize,
      modelName: "Teacher",
      tableName: "Teachers",
      underscored: true,
    }
  );
  return Teacher;
};
