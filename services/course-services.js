// sequelize
const { Op } = require("sequelize");
const { User, Course, Teacher } = require("../models");
const {
  getWeekdays,
  getHours,
  futureDate,
  removeDuplicates,
} = require("../helpers/date-helpers");
const courseService = {
  // 已評分的課程
  getScoredCourses: async (req, cb) => {
    try {
      const userId = req.params.id;
      const scoredCourses = await Course.findAll({
        raw: true,
        nest: true,
        where: {
          [Op.and]: [{ teacherId: userId }, { score: { [Op.not]: null } }],
        },
        include: [Teacher],
      });
      if (!scoredCourses.length) throw new Error("ScoredCourses is not exist!");
      return cb(null, { scoredCourses });
    } catch (e) {
      cb(e);
    }
  },
  // 老師未完成的課程
  getNotDoneCourses: async (req, cb) => {
    try {
      const userId = req.params.id;
      const notDoneCoursesData = await Course.findAll({
        raw: true,
        nest: true,
        where: { teacherId: userId, isDone: false },
        include: [Teacher, User],
      });
      if (!notDoneCoursesData.length)
        throw new Error("Teacher didn't exist or no not done course!");
      const notDoneCourses = notDoneCoursesData.map((item) => {
        delete item.User.password;
        return item;
      });
      if (!notDoneCourses.length) throw new Error("No course is not done!");
      return cb(null, { notDoneCourses });
    } catch (e) {
      cb(e);
    }
  },
  // 老師完成的課程
  getDoneCourses: async (req, cb) => {
    try {
      // 老師的課程
      const courses = await Teacher.findAll({
        raw: true,
        nest: true,
        where: { id: req.params.id },
        include: [Course],
      });
      if (!courses.length) {
        throw new Error("Teacher didn't exist or no finished course!");
      }
      // 有評分的課程
      const scoredCourses = courses.filter((item) => {
        return item.Courses.score !== null;
      });
      let courseScore = scoredCourses.map((item) => {
        return {
          id: item.Courses.id,
          score: item.Courses.score,
          intro: item.intro,
        };
      });
      // 老師評分
      const scores = scoredCourses.map((item) => {
        return item.Courses.score;
      });
      let averageScore = 0;
      for (let i = 0; i < scores.length; i++) {
        averageScore += scores[i];
      }
      averageScore = averageScore / scores.length;
      return cb(null, { courseScore, averageScore });
    } catch (e) {
      cb(e);
    }
  },
  // 可預約課程
  getCoursesInTwoWeeks: async (req, cb) => {
    try {
      const teacherId = req.params.id;
      // 今天的日期資訊 毫秒、星期
      const startDate = Date.now();
      const todayDay = new Date(startDate).getDay();
      // 課程可預約的時間範圍
      const startHour = 18;
      const endHour = 21;

      // 老師的已開課程資料
      const courses = await Teacher.findAll({
        raw: true,
        nest: true,
        where: { id: teacherId },
        include: [Course],
      });

      // 已預約時間
      const filteredCourses = courses
        .map((item) => {
          return item.Courses.date.getTime();
        })
        .filter((i) => i > startDate);

      // 老師的課程持續時間及可預約星期
      const courseData = await Teacher.findOne({
        raw: true,
        nest: true,
        where: {
          id: teacherId,
        },
        attributes: [
          "courseDuration",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      });
      if (!courseData)
        throw new Error("TeacherId didn't exist or no available appointment!");
      const courseDuration = courseData.courseDuration;
      const availableWeekday = [
        courseData.sunday,
        courseData.monday,
        courseData.tuesday,
        courseData.wednesday,
        courseData.thursday,
        courseData.friday,
        courseData.saturday,
      ];

      // 取得課程可以預約的時間陣列
      const hourList = getHours(startHour, endHour, courseDuration);

      // 2週內可以預約的日期
      const firstWeek = getWeekdays(startDate, availableWeekday);

      // 未來2週可預約時間
      const allTime = firstWeek
        .map((item) => {
          return futureDate(item.date, hourList, item.day - todayDay);
        }) // 去除空陣列(今日不能預約的時間)
        .filter((item) => {
          return item.length !== 0;
        });
      const allDates = [];
      allTime.forEach((item) => {
        item.forEach((i) => {
          i = Math.floor(i / 1000) * 1000;
          allDates.push(i);
        });
      });

      // 排除已預約時間 removeDuplicates
      const sortDays = allDates.concat(filteredCourses).sort((a, b) => a - b);
      removeDuplicates(sortDays);

      // 最後整理格式
      const final = sortDays.map((item) => {
        return { date: new Date(item) };
      });

      return cb(null, { final });
    } catch (e) {
      cb(e);
    }
  },
  // 預約課程
  postCourse: async (req, cb) => {
    const userId = req.user.id;
    const teacherId = Number(req.params.id);
    const { date } = req.body;
    const courseTime = Date.now(date);
    const today = Date.now();
    Promise.all([
      Teacher.findOne({
        raw: true,
        nest: true,
        where: { id: teacherId },
      }),
      User.findOne({
        where: { id: userId },
      }),
    ])
      .then(([teacher, user]) => {
        if (!teacher) throw new Error("Teacher doesn't exist!");
        if (!user) throw new Error("User doesn't exist!");
        const hours = user.courseHours + teacher.courseDuration;
        user.update({ courseHours: hours });
      })
      .then(() => {
        const newCourse = Course.create({
          date,
          isDone: courseTime > today ? true : false,
          score: null,
          comment: null,
          teacherId,
          userId,
        });
        return newCourse;
      })
      .then((newCourse) => {
        newCourse = newCourse.toJSON();
        return cb(null, { newCourse });
      })
      .catch((e) => {
        cb(e);
      });
  },
  postScore: (req, cb) => {
    const userId = Number(req.params.id);
    const { courseID, score, comment } = req.body;
    if (!score || !comment) throw new Error("All data are required!");
    Course.findOne({
      where: { id: Number(courseID), userId: userId },
    })
      .then((course) => {
        if (!course) throw new Error("Course didn't exist!!");
        const scoredCourse = course.update({
          score,
          comment,
        });
        return scoredCourse;
      })
      .then((course) => {
        course = course.toJSON();
        return cb(null, { course });
      })
      .catch((e) => {
        cb(e);
      });
  },
};
module.exports = courseService;
/*
postScore: async (req, cb) => {
    const userId = Number(req.params.id);
    const { courseID, score, comment } = req.body;
    
    Course.findAll({
      where: { id: Number(courseID), userId: userId },
    })
      .then((course) => {
        if (!score || !comment) {
          throw new Error("All datas are required!");
        }

        if (!course) throw new Error("Course did not exist!");
        if (course?.length > 0) {
          course[0].update({
            score,
            comment,
          });
        }
        return course;
      })
      .then((course) => {
        return cb(null, { course });
      })
      .catch((e) => {
        cb(e);
      });
  },
*/
