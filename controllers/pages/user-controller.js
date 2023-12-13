// service
const userService = require("../../services/user-services.js");
const teacherService = require('../../services/teacher-services.js')
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
  getUserPage: (req, res, next) => {
    Promise.all([
      teacherService.getScore(req, (err, data) => {
        if (err) {
          next(err);
        }
        return data.averageScore;
      }),
      userService.getNotDoneCourses(req, (err, data) => {
        if (err) {
          next(err);
        }      
        return data.notDoneCourses;
      }),
      userService.getNotRatedCourses(req, (err, data) => {
        if (err) {
          next(err);
        }        
        return data.notRatedCourses;
      }),
      userService.getRanking(req, (err, data) => {
        if (err) {
          next(err);
        }        
        return data.ranking;
      }),
    ])
      .then(([averageScore, notDoneCourses, notRatedCourses, ranking]) => {
        res.render("user/profile", {
          averageScore,
          notDoneCourses,
          notRatedCourses,
          ranking,
        });
      })
      .catch((e) => {
        next(e);
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
