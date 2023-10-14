"use strict";
// 載入
const bcrypt = require("bcryptjs");
const faker = require("faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        name: 'root',
        email: "root@example.com",
        password: await bcrypt.hash("12345678", 10),
        is_admin: true,
        is_teacher: false,
        intro: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", {});
  },
};
