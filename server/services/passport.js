const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

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

// tell passport to use this strategy
passport.use(jwtLogin);
