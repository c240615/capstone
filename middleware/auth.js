const { getUser, ensureAuthenticated } = require("../helpers/auth-helpers");
// 是否已登入
const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next();
  }
  res.redirect("/signin");
};
// 是否為 admin
const authenticatedAdmin = (req, res, next) => {
  // 檢查是否已登入
  if (ensureAuthenticated(req)) {
    // 檢查是否為 admin
    if (getUser(req).isAdmin) return next();
    res.redirect("/");
  }
  res.redirect("/signin");
};

module.exports = { authenticated, authenticatedAdmin };
