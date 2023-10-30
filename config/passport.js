const passport = require("passport");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passportJWT = require("passport-jwt");

const bcrypt = require("bcryptjs");
const { User, Teacher } = require("../models");
// 使用 jwt
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
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
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      const { name, email } = profile._json;
      User.findOne({ where: { email } }).then((user) => {
        if (user) return cb(null, user);
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
          .then((user) => cb(null, user))
          .catch((err) => cb(err, false));
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_ID}`,
      clientSecret: `${process.env.GOOGLE_SECRET}`,
      callbackURL: `${process.env.GOOGLE_CALLBACK}`,
      profileFields: ["email", "displayName"],
    },
    (accessToken, refreshToken, profile, cb) => {
      const { name, email } = profile._json;
      User.findOne({ where: { email } }).then((user) => {
        if (user) return cb(null, user);
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
          .then((user) => cb(null, user))
          .catch((err) => cb(err, false));
      });
    }
  )
);

// jwt
const jwtOptions = {
  // 指定 authorization header 裡的 bearer 項目 攜帶 token
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  // 使用密鑰來檢查 token 是否經過纂改
  secretOrKey: process.env.JWT_SECRET,
  // 加入 payload 的驗證資訊 optional
};
passport.use(
  new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
    // 驗證 token 後找到使用者並將其回傳
    User.findByPk(jwtPayload.id, {
      include: [{ model: Teacher }],
    })
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  })
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
