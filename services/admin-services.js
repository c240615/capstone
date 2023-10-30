const { User, Teacher, Course } = require("../models");
const { Op } = require("sequelize");
const { getOffset, getPagination } = require("../helpers/pagination-helper.js");

const adminService = {
  // 所有使用者
  getUsers: async (req, cb, next) => {
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
      // 去掉密碼
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
