const { User } = require("../models");
const bcrypt = require("bcryptjs");
const userService = {
  signUp: async (req, cb) => {
    if (req.body.password !== req.body.passwordCheck)
      throw new Error("Passwords do not match!");

    return await User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user) throw new Error("Email already exists!");
        return bcrypt.hash(req.body.password, 10);
      })
      .then(
        async (hash) =>
          await User.create({
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
};
module.exports = userService;
