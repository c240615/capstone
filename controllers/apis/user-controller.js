const jwt = require("jsonwebtoken");
const userController = {
  signInPage: (req, res, next) => {
    try {
      console.log(req);
      res.render("signin");
    } catch (e) {
      next(e);
    }
  },
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON();
      delete userData.password;
      
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      
      res.status(200).json({
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
