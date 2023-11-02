// service
const teacherService = require("../../services/teacher-services.js");
const userController = require("./user-controller.js");
const {
  getOffset,
  getPagination,
} = require("../../helpers/pagination-helper.js");
const teacherController = {
  // 取得所有教師
  getTeachers: (req, res, next) => {
    teacherService.getTeachers(req, (err, data) => {
      err
        ? next(err)
        : res.json({
            status: "success",
            data,
          });
    });
  },
  // 搜尋教師
  getSearchedTeachers: (req, res, next) => {
    teacherService.getTeachers(req, (err, data) => {
      console.log(data);
      const keyword = req.query.keyword.toLowerCase().trim();
      const filterDatas = data.teacherRows.filter((data) => {
        return data.User.name.toLowerCase().includes(keyword);
      });
      err
        ? next(err)
        : res.json({
            status: "success",
            keyword,
            filterDatas,
            pagination: data.pagination,
          });
    });
  },

  postBeTeacher: (req, res, next) => {
    teacherService.postBeTeacher(req, (err, data) => {
      err
        ? next(err)
        : res.json({
            status: "success",
            data,
          });
    });
  },
  // 取得教師平均分數
  getScore: (req, res, next) => {
    teacherService.getScore(req, (err, data) => {
      err
        ? next(err)
        : res.json({
            status: "success",
            data,
          });
    });
  },
  // 教師未完成課程
  getNotDoneCourses: (req, res, next) => {
    teacherService.getNotDoneCourses(req, (err, data) => {
      err
        ? next(err)
        : res.json({
            status: "success",
            data,
          });
    });
  },
  // 教師課程風格
  getTeacher: (req, res, next) => {
    teacherService.getTeacher(req, (err, data) => {
      err
        ? next(err)
        : res.json({
            status: "success",
            data,
          });
    });
  },

  // 前台搜尋老師
  getSearchedTeachers: async (req, res, next) => {
    await teacherService.getSearchedTeachers(req, (err, data) => {
      err
        ? next(err)
        : res.json({
            filterDatas: data.filterDatas,
            pagination: data.pagination,
          });
    });
  },
  getEditPage: async (req, res, next) => {
    return await Teacher.findByPk(req.params.id, {
      raw: true,
      nest: true,
    })
      .then((teacher) => {
        if (!teacher) throw new Error("Teacher didn't exist!");
        res.render("user/editTeacher", { teacher });
      })
      .catch((err) => next(err));
  },
  putTeacher: async (req, res, next) => {
    const {
      name,
      intro,
      style,
      courseDuration,
      link,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    } = req.body;
    if (!name || !intro || !style || !courseDuration || !link)
      throw new Error("Data are required!");
    console.log(req.body);
    return Promise.all([
      User.findByPk(req.user.id),
      Teacher.findByPk(req.params.id),
    ])
      .then(async ([user, teacher]) => {
        if (!user) throw new Error("User didn't exist!");
        if (!teacher) throw new Error("Teacher didn't exist!");
        await user.update({
          name,
        });
        await teacher.update({
          intro,
          style,
          courseDuration,
          link,
          monday: monday || 0,
          tuesday: tuesday || 0,
          wednesday: wednesday || 0,
          thursday: thursday || 0,
          friday: friday || 0,
          saturday: saturday || 0,
        });
      })
      .then(() => {
        req.flash("success_messages", "Data was successfully to update");
        res.redirect(`/teachers/${req.params.id}`);
      })
      .catch((e) => {
        next(e);
      });
  },
};
module.exports = teacherController;
