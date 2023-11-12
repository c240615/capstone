const adminService = require("../../services/admin-services.js");
const adminController = {
  getUsers: (req, res, next) => {
    adminService.getUsers(req, (err, data) => {
      err
        ? next(err)
        : res.render("admin/users", {
            userDatas: data.userDatas,
            pagination: data.pagination,
          });
    });
  },
  getSearchedUsers: (req, res, next) => {
    adminService.getSearchedUsers(req, (err, data) => {
      err
        ? next(err)
        : res.render("admin/filterUsers", {
            keyword: data.keyword,
            filterDatas: data.filterDatas,
            pagination: data.pagination,
          });
    });
  },
};
module.exports = adminController;
