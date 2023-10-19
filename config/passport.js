if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const passport = require("passport");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const { User } = require("../models");

// set up Passport strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },

    (req, email, password, cb) => {
      User.findOne({ where: { email } }).then((user) => {
        if (!user)
          return cb(
            null,
            false,
            req.flash("error_messages", "帳號或密碼輸入錯誤！")
          );
        bcrypt.compare(password, user.password).then((res) => {
          if (!res)
            return cb(
              null,
              false,
              req.flash("error_messages", "帳號或密碼輸入錯誤！")
            );
          return cb(null, user);
        });
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: `${process.env.FACEBOOK_ID}`,
      clientSecret: `${process.env.FACEBOOK_SECRET}`,
      callbackURL: `${process.env.FACEBOOK_CALLBACK}`,
      profileFields: ["email", "displayName"],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const { name, email } = profile._json;
      User.findOne({ where: { email } }).then((user) => {
        if (user) return done(null, user);
        const randomPassword = Math.random().toString(36).slice(-8);
        bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(randomPassword, salt))
          .then((hash) =>
            User.create({
              name,
              email,
              password: hash,
            })
          )
          .then((user) => done(null, user))
          .catch((err) => done(err, false));
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_SECRET}`,
      callbackURL: `${process.env.GOOGLE_CALLBACK}`,
      profileFields: ["email", "displayName"],
    },
    (accessToken, refreshToken, profile, done) => {
      const { name, email } = profile._json;
      User.findOne({ where: { email } }).then((user) => {
        if (user) return done(null, user);
        const randomPassword = Math.random().toString(36).slice(-8);
        bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(randomPassword, salt))
          .then((hash) =>
            User.create({
              name,
              email,
              password: hash,
            })
          )
          .then((user) => done(null, user))
          .catch((err) => done(err, false));
      });
    }
  )
);


// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then((user) => {
    //console.log(user);
    user = user.toJSON();
    return cb(null, user);
  });
});

module.exports = passport;
