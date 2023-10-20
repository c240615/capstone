const { User } = require("../../models");
const { getOffset, getPagination } = require("../../helpers/pagination-helper");

const adminService = {
  getUsers: async (req, res, next) => {
    const DEFAULT_LIMIT = 10;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || DEFAULT_LIMIT;
    const offset = getOffset(limit, page);
    const users = await User.findAndCountAll({
      raw: true,
      nest: true,
      limit,
      offset,
    })
      .then((users) => {
        const userDatas = users.rows;

        res.status(200).json({
          status: req.user ? "200" : "206",
          user: req.user ? req.user : "User did not login.",
          userDatas,
        });
      })
      .catch((err) => {
        next(err);
      });
  },
};

module.exports = adminService;