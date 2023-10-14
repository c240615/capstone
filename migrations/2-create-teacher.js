'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Teachers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      intro: {
        type: Sequelize.TEXT,
      },
      style: {
        type: Sequelize.TEXT,
      },
      link: {
        type: Sequelize.TEXT,
      },
      course_duration: {
        type: Sequelize.FLOAT,
      },      
      monday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      tuesday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      wednesday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      thursday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      friday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      saturday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      sunday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('Teachers');
  }
};