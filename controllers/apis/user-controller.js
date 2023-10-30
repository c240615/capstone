const jwt = require("jsonwebtoken");
// service
const userService = require("../../services/user-services.js");

const userController = {
  // 註冊
  signUp: (req, res, next) => {
    userService.signUp(req, (err, data) =>
      err ? next(err) : res.json({ status: "success", data })
    );
  },
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
};
module.exports = userController;
