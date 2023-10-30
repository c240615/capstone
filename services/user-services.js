// model
const { User, Teacher, Course } = require("../models");
// helper
const { localFileHandler } = require("../helpers/file-helpers.js");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const userService = {
  // 註冊
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck)
      throw new Error("Passwords do not match!");
    return User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user) throw new Error("Email already exists!");
        return bcrypt.hash(req.body.password, 10);
      })
      .then((hash) =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        })
      )
      .then((user) => {
        return cb(null, { user });
      })
      .catch((e) => {
        cb(e);
      });
  },
  // 現在登入的使用者資料
  getUser: async (req, cb) => {
    const id = Number(req.params.id);
    try {
      // 當前使用者基本資料
      const user = await User.findOne({
        raw: true,
        nest: true,
        where: { id },
        include: [Course],
      });
      delete user.password;
      // 未完成課程老師的使用者資料
      const notDoneCoursesData = await Course.findAll({
        raw: true,
        nest: true,
        where: { userId: id, isDone: false },
        include: [{ model: Teacher, include: [{ model: User }] }],
      });
      const notDoneCourses = notDoneCoursesData.map((item) => {
        delete item.Teacher.User.password;
        return item;
      });
      // 已完成未評分課程老師的使用者資料
      const notRatedCoursesData = await Course.findAll({
        raw: true,
        nest: true,
        where: {
          [Op.and]: [{ userId: id }, { score: null }, { isDone: true }],
        },
        include: [{ model: Teacher, include: [{ model: User }] }],
      });
      const notRatedCourses = notRatedCoursesData.map((item) => {
        delete item.Teacher.User.password;
        return item;
      });
      // 學習名次
      const topUsers = await User.findAll({
        raw: true,
        nest: true,
        order: [
          ["course_hours", "DESC"],
          ["name", "ASC"],
        ],
      });
      const top = topUsers.map((item) => {
        return item.name;
      });

      const number = top.indexOf(user.name) + 1;
      return cb(null, {
        user,
        notDoneCourses,
        notRatedCourses,
        number,
      });
    } catch (e) {
      cb(e);
    }
  },
  // 編輯使用者資料
  putUser: (req, cb) => {
    const { file } = req;
    const { name, nation, intro } = req.body;
    if (!name || !nation || !intro) throw new Error("User name is required!");
    Promise.all([User.findByPk(req.params.id), localFileHandler(file)]).then(
      ([user, filePath]) => {
        if (!user) throw new Error("user didn't exist!");
        return user
          .update({
            name,
            nation,
            intro,
            profile: filePath || user.profile,
          })
          .then((user) => {
            cb(null, { user });
          })
          .catch((e) => {
            cb(e);
          });
      }
    );
  },
};
module.exports = userService;
