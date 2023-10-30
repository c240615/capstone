const { Op } = require("sequelize");
// service
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
    userService.getUser(req, (err, data) => {
      err
        ? next(err)
        : res.render("user/profile", {
            user: data.user,
            notDoneCourses: data.notDoneCourses,
            notRatedCourses: data.notRatedCourses,
            number: data.number,
          });
    });
  },
  // 編輯頁
  getEditPage: (req, res, next) => {
    userService.getUser(req, (err, data) => {
      err
        ? next(err)
        : res.render("user/edit", {
            user: data.user,
            notDoneCourses: data.notDoneCourses,
            notRatedCourses: data.notRatedCourses,
            number: data.number,
          });
    });
  },
  // 編輯使用者資訊
  putUser: (req, res, next) => {
    userService.putUser(req, (err) => {
      if (err) {
        req.flash("error_messages", "編輯失敗！");
        next(err);
      }
      req.flash("success_messages", "編輯成功！");
      res.redirect(`/users/${req.params.id}`);
    });
  },
};
module.exports = userController;
