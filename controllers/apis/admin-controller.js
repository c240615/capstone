// service
const adminService = require("../../services/admin-services");
const adminController = {
  getUsers: async (req, res, next) => {
    await adminService.getUsers(req, (err, data) => {
      err
        ? next(err)
        : res.json({
            status: "success",
            data,
          });
    });
  },
  getSearchedUsers: async (req, res, next) => {
    await adminService.getUsers(req, (err, data) => {
      const keyword = req.query.keyword.toLowerCase().trim();
      const filterData = data.userDatas.filter((data) => {
        return data.name.toLowerCase().includes(keyword);
      });

      err
        ? next(err)
        : res.json({
            status: "success",
            keyword,
            filterData,
          });
    });
  },
};
module.exports = adminController;
