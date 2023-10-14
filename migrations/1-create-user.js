"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        defaultValue:"name"
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      profile: {
        type: Sequelize.STRING,
        defaultValue:
          "https://www.shutterstock.com/image-vector/man-icon-vector-250nw-1040084344.jpg",
      },
      nation: {
        type: Sequelize.STRING,
        defaultValue: "ROC",
      },
      intro: {
        type: Sequelize.TEXT,
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_teacher: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      course_hours: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
