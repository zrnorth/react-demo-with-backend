const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

// local email+pw strategy
const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(localOptions, function(
  email,
  password,
  done
) {
  // first verify this email exists
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(false);
    }
    // if it exists, compare passwords
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
});

// setup options for jwt strat
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"), // where to find the jwt
  secretOrKey: config.secret
};

// create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // see if the user id and payload exists in the db
  // if it does, call 'done' with that user
  // otherwise call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
