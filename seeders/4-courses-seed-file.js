"use strict";
const faker = require("faker");

// 取過去時間
function pastDate() {
  // 起始點
  const startDate = new Date("2023-01-01").getTime();
  // 至今毫秒數
  const endDate = new Date().getTime();
  const randomTimestamp =
    Math.floor(Math.random() * (endDate - startDate + 1)) + startDate;
  const time = new Date(randomTimestamp);
  time.setHours(Math.random() < 0.5 ? 18 : 19, 0, 0);
  return time;
}
// 取未來時間
function futureDate() {
  // 起始點
  const startDate = new Date().getTime();
  // 延後14天
  const change = 86400000 * 14;
  const endDate = new Date().getTime() + change;
  // 把 startDate 設成2周後的日期
  const randomTimestamp =
    Math.floor(Math.random() * (endDate - startDate + 1)) + startDate;
  const time = new Date(randomTimestamp);
  time.setHours(Math.random() < 0.5 ? 18 : 19, 0, 0);
  return time;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // userIds 陣列 [{id:1},{id:2}]
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const randomUsers = users.sort(() => Math.random() - 0.5);
    // teacherIds 陣列 [{id:1},{id:2}]
    const teacherIds = await queryInterface.sequelize.query(
      "SELECT id FROM Teachers;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // 已完成
    let oldCourses0 = Array.from({ length: 10 }, (item, index) => ({
      date: pastDate(),
      is_done: true,
      score: 1,
      comment: "no comment",
      user_id: randomUsers[index].id,
      teacher_id: teacherIds[index].id,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    let oldCourses1 = Array.from({ length: 10 }, (item, index) => ({
      date: pastDate(),
      is_done: true,
      score: null,
      comment: null,
      user_id: randomUsers[index].id,
      teacher_id: teacherIds[index].id,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    let oldCourses2 = Array.from({ length: 10 }, (item, index) => ({
      date: pastDate(),
      is_done: true,
      score: null,
      comment: null,
      user_id: randomUsers[index].id,
      teacher_id: teacherIds[index].id,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // 未完成
    let newCourses1 = Array.from({ length: 10 }, (item, index) => ({
      date: futureDate(),
      is_done: false,
      score: null,
      comment: null,
      user_id: randomUsers[index].id,
      teacher_id: teacherIds[index].id,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    let newCourses2 = Array.from({ length: 10 }, (item, index) => ({
      date: futureDate(),
      is_done: false,
      score: null,
      comment: null,
      user_id: randomUsers[index].id,
      teacher_id: teacherIds[index].id,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    await queryInterface.bulkInsert("Courses", oldCourses0);
    await queryInterface.bulkInsert("Courses", oldCourses1);
    await queryInterface.bulkInsert("Courses", oldCourses2);
    await queryInterface.bulkInsert("Courses", newCourses1);
    await queryInterface.bulkInsert("Courses", newCourses2);
    await queryInterface.sequelize.query(`UPDATE Users SET course_hours = 5`);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Courses", {});
  },
};
