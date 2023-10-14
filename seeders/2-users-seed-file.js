"use strict";
// 載入
const bcrypt = require("bcryptjs");
const faker = require("faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        name: "user1",
        email: "user1@example.com",
        password: await bcrypt.hash("12345678", 10),
        is_admin: false,
        is_teacher: false,
        intro: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "user2",
        email: "user2@example.com",
        password: await bcrypt.hash("12345678", 10),
        is_admin: false,
        is_teacher: false,
        intro: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "user3",
        email: "user3@example.com",
        password: await bcrypt.hash("12345678", 10),
        is_admin: false,
        is_teacher: false,
        intro: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    let users = Array.from({ length: 6 }).map(async () => {
      return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: await bcrypt.hash("12345678", 10),
        is_admin: false,
        is_teacher: false,
        intro: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
      };
    });    
    users = await Promise.all(users);// 資料新增不完全
    await queryInterface.bulkInsert("Users", users);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", {});
  },
};
