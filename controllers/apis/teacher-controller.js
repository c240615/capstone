const { Teacher, User, Course } = require("../../models");
const { getOffset, getPagination } = require("../../helpers/pagination-helper");
const teacherController = {
  getTeachers: async (req, res, next) => {
    try { 
      
      const teachers = await Teacher.findAndCountAll({
        raw: true,
        nest: true,
        include: [User],
        limit,
        offset,
      });  

      const teacherDatas = teachers.rows;
      return res.render("teachers", {
        teacherDatas,
        
        pagination: getPagination(limit, page, teachers.count),
        
      });
    } catch (err) {
      next(err);
    }
  },
};
module.exports = teacherController;
