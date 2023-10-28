const { User, Course } = require("../models");
const bcrypt = require("bcryptjs");
const userService = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck)
      throw new Error("Passwords do not match!");

    return User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user) throw new Error("Email already exists!");
        return bcrypt.hash(req.body.password, 10);
      })
      .then((hash) =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        })
      )
      .then((user) => {
        return cb(null, { user });
      })
      .catch((e) => {
        cb(e);
      });
  },
  getUser: (req, cb) => {    
    const id = Number(req.params.id)
    console.log(id)
    return User.findOne({
      raw: true,
      nest: true,
      where: { id },
      include: [Course],
    })
      .then((user) => {
        console.log(user);
        return cb(null, { user });
      })
      .catch((e) => {
        cb(e);
      });
  },
};
module.exports = userService;
