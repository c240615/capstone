const jwt = require("jsonwebtoken");
const userService = require("../../services/user-services");
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
      res.json({
        status: "success",
        data: {
          token,
          user: userData,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  // 取得使用者資訊
  getUserPage: (req,res,next) => {
    res.send("getUserPage");
  },
  // 編輯使用者資訊
};
module.exports = userController;
