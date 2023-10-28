// service
const teacherService = require("../../services/teacher-services");
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
  getSearchedTeachers: (req, res, next) => {
    teacherService.getTeachers(req, (err, data) => {
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
};
module.exports = teacherController;
