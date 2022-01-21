const express = require("express");
const authrouter = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User.js");

authrouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err.message;
        res.send(user);
      });
    }
  })(req, res, next);
});
authrouter.get("/user", (req, res, next) => {
  res.send(req.user);
});

authrouter.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) res.send("User Already Exists");
    else {
      bcrypt.hash(req.body.password, 10).then((password) => {
        const newUser = new User({
          username: req.body.username,
          password: password,
        });
        newUser
          .save()
          .then(res.send("User Created"))
          .catch((err) => console.log(err.message));
      });
    }
  });
});

authrouter.get("/logout", (req, res, next) => {
  req.logOut();
  req.session.destroy(function (err) {
    res.sendStatus(200);
  });
});

module.exports = authrouter;
