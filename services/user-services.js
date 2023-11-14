// sequelize
const { Op } = require("sequelize");
// model
const { User, Teacher, Course } = require("../models");
// helper
const { localFileHandler } = require("../helpers/file-helpers.js");
// bcryptjs
const bcrypt = require("bcryptjs");

const userService = {
  // 註冊
  signUp: async (req, cb) => {
    if (req.body.password !== req.body.passwordCheck)
      throw new Error("Passwords do not match!");
    return await User.findOne({ where: { email: req.body.email } })
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
  // 當前使用者基本資料
  getUser: async (req, cb) => {
    try {
      const id = Number(req.params.id);
      const user = await User.findOne({
        raw: true,
        nest: true,
        where: { id },
        include: [Course],
      });
      if (!user) throw new Error("User didn't exist!");
      delete user.password;
      return cb(null, {
        user,
      });
    } catch (e) {
      cb(e);
    }
  },
  // 未完成課程老師的使用者資料
  getNotDoneCourses: async (req, cb) => {
    try {
      const id = Number(req.params.id);
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
      if (!notDoneCourses.length)
        throw new Error("NotDoneCourses didn't exist!");
      return cb(null, { notDoneCourses });
    } catch (e) {
      cb(e);
    }
  },
  // 已完成未評分課程老師的使用者資料
  getNotRatedCourses: async (req, cb) => {
    try {
      const id = Number(req.params.id);
      const notRatedCoursesData = await Course.findAll({
        raw: true,
        nest: true,
        where: {
          [Op.and]: [{ userId: id }, { score: null }, { isDone: true }],
        },
        include: [{ model: Teacher, include: [{ model: User }] }],
      });
      const notRatedCourses =
        notRatedCoursesData.map((item) => {
          delete item.Teacher.User.password;
          return item;
        }) || "沒有相關課程";
      if (!notRatedCourses.length)
        throw new Error("NotRatedCourses didn't exist!");
      
      return cb(null, { notRatedCourses });
    } catch (e) {
      cb(e);
    }
  },
  // 學習名次
  getRanking: async (req, cb) => {
    try {
      const id = Number(req.params.id);

      const user = await User.findOne({
        raw: true,
        nest: true,
        where: { id },
      });
      if (!user) throw new Error("User didn't exist!");
      const topUsers = await User.findAll({
        raw: true,
        nest: true,
        order: [
          ["course_hours", "DESC"],
          ["name", "ASC"],
        ],
      });
      const topName = topUsers.map((item) => {
        return item.name;
      });
      const ranking = topName.indexOf(user.name) + 1;
      return cb(null, { ranking });
    } catch (e) {
      cb(e);
    }
  },
  // 排行榜
  getTopUsers: async (req, cb) => {
    try {
      const topUsers = await User.findAll({
        raw: true,
        nest: true,
        limit: 10,
        order: [
          ["course_hours", "DESC"],
          ["name", "ASC"],
        ],
      });
      if (!topUsers) throw new Error("No topUsers data!");
      const topTen = topUsers.map((item, index) => {
        return { profile: item.profile, index: index + 1, name: item.name };
      });
      return cb(null, { topTen });
    } catch (e) {
      cb(e);
    }
  },
  // 編輯使用者資料
  putUser: (req, cb) => {
    const { file } = req;
    const { name, nation, intro } = req.body;
    if (!name || !nation || !intro) throw new Error("All datas are required!");
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
            delete user.dataValues.password;
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
