"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Courses", "teacher_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Teachers",
        key: "id",
      },
    });
    // student_id
    await queryInterface.addColumn("Courses", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    });    
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Courses", "teacher_id");
    await queryInterface.removeColumn("Courses", "user_id");
  },
};
