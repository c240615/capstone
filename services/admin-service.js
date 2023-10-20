const { User } = require("../models");
const { getOffset, getPagination } = require("../helpers/pagination-helper");

const adminService = {
  getUsers: async (req, cb) => {
    try {
      const DEFAULT_LIMIT = 10;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || DEFAULT_LIMIT;
      const offset = getOffset(limit, page);
      const users = await User.findAndCountAll({
        raw: true,
        nest: true,
        limit,
        offset,
      });
      const userDatas = users.rows;
      return cb(null, {
        userDatas,
        pagination: getPagination(limit, page, users.count),
      });
    } catch (e) {
      cb(e);
    }
  },
};

module.exports = adminService;
