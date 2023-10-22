// service
const adminService = require("../../services/admin-service");
const adminController = {
  getUsers: async (req, res, next) => {
    await adminService.getUsers(req, (err, data) => {
      console.log(data.userDatas); // []
      err
        ? next(err)
        : res.status(200).json({
            status: "200",
            user: req.user ? req.user : "User did not login.",
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
        : res.status(200).json({
            status: "200",
            user: req.user ? req.user : "User did not login.",
            filterData,
          });
    });
  },
};
module.exports = adminController;
