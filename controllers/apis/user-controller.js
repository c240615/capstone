const jwt = require("jsonwebtoken");
const userService = require("../../services/user-services.js");
const userController = {
  signUp:(req,res,next)=>{
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
};
module.exports = userController;
