const { User } = require("../models");

const { getOffset, getPagination } = require("../helpers/pagination-helper.js");

const adminService = {
  // 所有使用者
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
      // 去掉密碼
      const userDatas = users.rows.map((item) => {
        delete item.password;
        return item;
      });
      return cb(null, {
        userDatas,
        pagination: getPagination(limit, page, users.count),
      });
    } catch (e) {
      cb(e);
    }
  },
  // searchedUser
  getSearchedUsers: async (req, cb) => {
    try {
      const keyword = req.query.keyword.toLowerCase().trim();
      if (!keyword) throw new Error("Keyword is required!");
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
      const userDatas = users.rows.map((item) => {
        delete item.password;
        return item;
      });
      const filterDatas = userDatas.filter((data) => {
        return data.name.toLowerCase().includes(keyword);
      });
      return cb(null, {
        keyword,
        filterDatas,
        pagination: getPagination(limit, page, filterDatas.length),
      });
    } catch (e) {
      cb(e);
    }
  },
};

module.exports = adminService;
