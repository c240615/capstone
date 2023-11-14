const jwt = require("jsonwebtoken");
const userService = require("../../services/user-services.js");

const userController = {
  // 登入
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON();
      delete userData.password;
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      
      return res.json({
        status: "success",
        data: {
          token,
          user: userData,
        },
      });
    } catch (e) {      
      next(e);
    }
  },
  // 註冊
  signUp: (req, res, next) => {
    userService.signUp(req, (err, data) =>
      err ? next(err) : res.json({ status: "success", data })
    );
  },
  // 目前登入的使用者資訊
  getUser: (req, res, next) => {
    userService.getUser(req, (err, data) =>
      err ? next(err) : res.json({ status: "success", data })
    );
  },
  // 編輯使用者資訊
  putUser: (req, res, next) => {
    userService.putUser(req, (err, data) => {
      err ? next(err) : res.json({ status: "success", data });
    });
  },
  // 未完成課程老師的使用者資料
  getNotDoneCourses: async (req, res, next) => {
    userService.getNotDoneCourses(req, (err, data) =>
      err ? next(err) : res.json({ status: "success", data })
    );
  },
  // 已完成未評分課程老師的使用者資料
  getNotRatedCourses: async (req, res, next) => {
    userService.getNotRatedCourses(req, (err, data) =>
      err ? next(err) : res.json({ status: "success", data })
    );
  },
  // 學習名次
  getRanking: async (req, res, next) => {
    userService.getRanking(req, (err, data) =>
      err ? next(err) : res.json({ status: "success", data })
    );
  },
  // 排行榜
  getTopUsers: async (req, res, next) => {
    userService.getTopUsers(req, (err, data) =>
      err ? next(err) : res.json({ status: "success", data })
    );
  },
};
module.exports = userController;
