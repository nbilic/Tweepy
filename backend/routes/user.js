const express = require("express");
const userrouter = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const format = file.mimetype === "image/png" ? ".png" : ".gif";
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    console.log("failed");
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 256000,
  },
  fileFilter: fileFilter,
});

userrouter.get("/", (req, res) => {
  User.find({})
    .then((user) => res.json(user))
    .catch((err) => res.send(err.message));
});

userrouter.post("/updateHandle", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    { handle: req.body.handle },
    { new: true },
    (err, user) => {
      if (user) res.send(user);
      if (err) {
        res.send(err.message);
        console.log("Something wrong when posting the data!");
      }
    }
  );
});

userrouter.post("/updatePassword", (req, res) => {
  bcrypt.hash(req.body.password, 10).then((password) => {
    User.findOneAndUpdate(
      { _id: req.body.id },
      { password: password },
      { new: true },
      (err) => {
        if (err) {
          res.send(err.message);
          console.log("Something wrong when posting the data!");
        }
      }
    );
  });

  res.send("ok");
});

userrouter.post("/updateDescription", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.id },
    { description: req.body.description },
    { new: true },
    (err, user) => {
      if (user) res.send(user);
      if (err) {
        res.send(err.message);
        console.log("Something wrong when posting the data!");
      }
    }
  );
});

userrouter.post(
  "/updateAvatar/:id",
  upload.single("userAvatar"),
  (req, res) => {
    console.log(req.file);
    User.findOneAndUpdate(
      { _id: req.params.id },
      { avatar: req.file.path },
      { new: true },
      (err, user) => {
        if (user) res.send(user);
        if (err) {
          res.send(err.message);
          console.log("Something wrong when posting the data!");
        }
      }
    );
  }
);

userrouter.get("/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => res.json(user))
    .catch((err) => res.send(err.message));
});

userrouter.get("/username/:username", (req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => res.json(user))
    .catch((err) => res.send(err.message));
});

userrouter.get("/profile/:username", (req, res) => {
  User.findOne({ _id: req.params.username })
    .then((user) => res.json(user))
    .catch((err) => res.send(err.message));
});

userrouter.post("/follow", (req, res) => {
  const payload = req.body.follows
    ? {
        $pull: { following: req.body.followed },
      }
    : { $addToSet: { following: req.body.followed } };

  User.findOneAndUpdate(
    { _id: req.body.follower },
    payload,
    { new: true },
    (err, user) => {
      res.send({
        follows: req.body.follows ? false : true,
        user: user,
      });
      if (err) {
        res.send(err.message);
        console.log("Something wrong when posting the data!");
      }
    }
  );

  const payload2 = req.body.follows
    ? { $pull: { followers: req.body.follower } }
    : { $addToSet: { followers: req.body.follower } };

  User.findOneAndUpdate(
    { _id: req.body.followed },
    payload2,
    { new: true },
    (err) => {
      if (err) {
        res.send(err.message);
        console.log("Something wrong when posting the data!");
      }
    }
  );
});

userrouter.get("/followers/:id", (req, res) => {
  //
});

module.exports = userrouter;
