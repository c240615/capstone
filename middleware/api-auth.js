const passport = require("../config/passport.js"); 
// 使用者登入認證
const authenticated = passport.authenticate("jwt", { session: false });
// admin 登入認證
const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next();
  return res
    .status(403)
    .json({ status: "error", message: "permission denied" });
};
module.exports = {
  authenticated,
  authenticatedAdmin,
};
