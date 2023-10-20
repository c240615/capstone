// service
const adminService = require("../../services/admin-service");
const adminController = {
  getUsers: async (req, res, next) => {
    adminService.getUsers(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
            status: req.user ? "200" : "206",
            user: req.user ? req.user : "User did not login.",
            userDatas: data.userDatas,
            pagination: data.pagination,
          });
    });
  },
  getSearchedUsers: async (req, res, next) => {
    const keyword = req.query.keyword.toLowerCase().trim();
    const DEFAULT_LIMIT = 10;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || DEFAULT_LIMIT;
    const offset = getOffset(limit, page);
    await User.findAndCountAll({ raw: true, nest: true, limit, offset })
      .then(async (users) => {
        const filterData = users.rows.filter((data) => {
          return data.name.toLowerCase().includes(keyword);
        });
        const count =
          filterData.length / DEFAULT_LIMIT < 9
            ? 1
            : Math.floor(filterData.length / DEFAULT_LIMIT);
        if (!filterData.length) {
          req.flash("error_messages", "User is not exist!");
          res.render("admin/filterUsers", {
            filterData,
            keyword,
            pagination: getPagination(limit, page, count),
          });
        } else {
          req.flash("success_messages", "Found User!");
          res.render("admin/filterUsers", {
            filterData,
            keyword,
            pagination: getPagination(limit, page, count),
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  },
};
module.exports = adminController;
