const { User, Teacher } = require("../models");
const { getOffset, getPagination } = require("../helpers/pagination-helper");
const dayjs = require("dayjs");

const adminService = {
  getUsers: (req, cb) => {
    const DEFAULT_LIMIT = 9;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || DEFAULT_LIMIT;
    const offset = getOffset(limit, page);
    User.findAndCountAll({
      raw: true,
      nest: true,
      attributes: { exclude: ["password"] },
      include: {
        model: Teacher,
        attributes: ["id", "intro", "method", "availableWeekdays"],
      },
      limit,
      offset,
    })
      .then((users) => {
        const result = users.rows.map((user) => ({
          ...user,
          createdAt: dayjs(user.createdAt).format("YYYY-MM-DD"),
          // 將availableWeekdays解析並排序
          availableWeekdays: user.TeacherInfo.availableWeekdays
            ? JSON.parse(user.TeacherInfo.availableWeekdays).sort(
                (a, b) => a - b
              )
            : null,
        }));
        return cb(null, {
          result,
          pagination: getPagination(limit, page, users.count),
        });
      })
      .catch((error) => cb(error));
  },
  getSearchedUsers: (req, next) => {
    const keyword = req.query.keyword.toLowerCase().trim();
    // 原生物件轉單純物件, 轉巢狀
    User.findAll({ raw: true, nest: true })
      .then((users) => {
        const filterData = users.filter((data) => {
          return data.name.toLowerCase().includes(keyword);
        });
        if (!filterData.length) {
          res.render("admin/users", { users, keyword });        
        }else{
          res.render("admin/users", { filterData, keyword });
        }
      })
      .catch((err) => {
        next(err);
      });
  },
};
module.exports = adminService;
