const teacherService = require("../../services/teacher-services.js");

const teacherController = {
  // 當前教師資料
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
  // 取得所有教師資料
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
  // 成為老師
  postBeTeacher: async(req, res, next) => {
    await teacherService.postBeTeacher(req, (err, data) => {      
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
  // 編輯教師資訊
  putTeacher: async (req, res, next) => {
    return teacherService.putTeacher(req, (err, data) => {
      err
        ? next(err)
        : res.json({
            status: "success",
            data,
          });
    });
  },
};
module.exports = teacherController;
