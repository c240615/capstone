const jwt = require("jsonwebtoken");
const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON();
      console.log(userData);
      delete userData.password;
      // 發給用戶端
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
    } catch (e) {
      next(e);
    }
  },
};
module.exports = userController;
