const { Op } = require("sequelize");
const bcrypt = require("bcryptjs")
const userService = require("../../services/user-services.js");
// model
const { User, Teacher, Course } = require("../../models");
// helper
const { localFileHandler } = require("../../helpers/file-helpers.js");

const userController = {
  // 註冊頁
  signUpPage: (req, res) => {
    res.render("signup");
  },
  // 註冊
  signUp: (req, res, next) => {    
    userService.signUp(req, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success_messages", "成功註冊帳號！");
      res.redirect("/signin");
    });
  },
  // 登入頁
  signInPage: (req, res) => {
    res.render("signin");
  },
  // 登入
  signIn: (req, res) => {
    req.flash("success_messages", "成功登入！");
    res.redirect("/teachers");
  },
  // 登出
  logout: (req, res, next) => {
    req.flash("success_messages", "登出成功！");
    req.logout(function (err, next) {
      if (err) {
        return next(err);
      }
      res.redirect("/signin");
    });
  },
  // 使用者資訊頁
  getUserPage: async (req, res, next) => {
    try {
      // 學生基本資料
      const user = await User.findOne({
        raw: true,
        nest: true,
        where: { id: req.user.id },
        include: [Course],
      });
      // 未完成課程老師的使用者資料
      const notDoneCourses = await Course.findAll({
        raw: true,
        nest: true,
        where: { userId: req.user.id, isDone: false },
        include: [{ model: Teacher, include: [{ model: User }] }],
      });

      // 已完成未評分課程老師的使用者資料
      const notRatedCourses = await Course.findAll({
        raw: true,
        nest: true,
        where: {
          [Op.and]: [
            { userId: req.user.id },
            { score: null },
            { isDone: true },
          ],
        },
        include: [{ model: Teacher, include: [{ model: User }] }],
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

      res.render("user/profile", {
        user,
        notDoneCourses,
        notRatedCourses,
        number,
      });
    } catch (e) {
      next(e);
    }
  },
  // 編輯頁
  getEditPage: async (req, res, next) => {
    return await User.findByPk(req.params.id, {
      raw: true,
      nest: true,
    })
      .then((user) => {
        if (!user) throw new Error("user didn't exist!");

        res.render("user/edit", { user });
      })
      .catch((err) => next(err));
  },
  // 編輯使用者資訊
  putUser: (req, res, next) => {
    const { name, nation, intro } = req.body;
    if (!name || !nation || !intro) throw new Error("User name is required!");
    const { file } = req;
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
          .then(() => {
            req.flash("success_messages", "user was successfully to update");
            res.redirect(`/users/${req.params.id}`);
          })
          .catch((err) => {
            req.flash("error_messages", "user was not successfully to update");
            next(err);
          });
      }
    );
  },
};
module.exports = userController;
