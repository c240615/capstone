"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 一個使用者可以登記成為老師
      User.hasOne(models.Teacher, { foreignKey: "userId" });
      // 一個使用者可以預約多堂課
      User.hasMany(models.Course, { foreignKey: "userId" });      
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      profile: DataTypes.STRING,
      nation: DataTypes.STRING,
      intro: DataTypes.TEXT,
      isAdmin: DataTypes.BOOLEAN,
      isTeacher: DataTypes.BOOLEAN,
      courseHours: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      underscored: true,
    }
  );
  return User;
};
