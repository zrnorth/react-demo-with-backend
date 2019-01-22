const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../config"); // This doesn't exist in git, remember to create it

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
  // note: sub = subject, iat = issued at time
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide an email and password" });
  }

  // See if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }
    // if the user does exist, return error
    if (existingUser) {
      return res.status(422).send({ error: "Email is in use" });
    }
    // if does not exist, save user record
    const user = new User({ email: email, password: password });

    user.save(function(err) {
      if (err) {
        return next(err);
      }

      // response to request indicating created or not
      res.json({ token: tokenForUser(user) });
    });
  });
};
