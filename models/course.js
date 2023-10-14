"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    
    static associate(models) {
      // 一堂課有多位學生
      Course.belongsTo(models.User, { foreignKey: "userId" });
      // 一堂課有一位老師
      Course.belongsTo(models.Teacher, { foreignKey: "teacherId" });      
    }
  }
  Course.init(
    {
      date: DataTypes.DATE,
      isDone: DataTypes.BOOLEAN,
      score: DataTypes.INTEGER,
      comment: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      teacherId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Course",
      tableName: "Courses",
      underscored: true,
    }
  );
  return Course;
};
