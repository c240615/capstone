"use strict";
const faker = require("faker");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // users 陣列 [{id:1},{id:2}]
    const userIds = await queryInterface.sequelize.query(
      "SELECT id FROM Users;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    await queryInterface.bulkInsert(
      "Teachers",
      Array.from({ length: 10 }, (item, index) => ({
        intro: faker.lorem.lines(1),
        style: faker.lorem.lines(1),
        link: faker.lorem.lines(1),
        course_duration: 1,
        monday: Math.random() < 0.5 ? true : false,
        tuesday: Math.random() < 0.5 ? true : false,
        wednesday: Math.random() < 0.5 ? true : false,
        thursday: Math.random() < 0.5 ? true : false,
        friday: Math.random() < 0.5 ? true : false,
        saturday: Math.random() < 0.5 ? true : false,
        sunday: Math.random() < 0.5 ? true : false,
        user_id: userIds[index].id,
        created_at: new Date(),
        updated_at: new Date(),
      }))
    );
    await queryInterface.sequelize.query(`UPDATE Users SET is_teacher = true`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Teachers", {});
    await queryInterface.sequelize.query(`UPDATE Users SET is_teacher = false`);
  },
};

