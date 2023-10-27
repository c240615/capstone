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
  getSearchedUsers: async (req, res, next) => {
    await adminService.getUsers(req, (err, data) => {
      // 符合搜索的資料
      const keyword = req.query.keyword.toLowerCase().trim();
      if (!keyword) throw new Error("Keyword did not exist!");
      const filterData = data.userDatas.filter((data) => {
        return data.name.toLowerCase().includes(keyword);
      });
      err
        ? next(err)
        : res.render("admin/filterUsers", {
            status: "200",
            user: req.user ? req.user : "User did not login.",
            filterData,
          });
    });
  },
};
module.exports = adminController;
