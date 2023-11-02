// service
const adminService = require("../../services/admin-services.js");

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
    await adminService.getSearchedUsers(req, (err, data) => {
      err
        ? next(err)
        : res.json({
            status: "success",
            data
          });
    });
  },
};
module.exports = adminController;
