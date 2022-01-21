const express = require("express");
const tweetsrouter = express.Router();
const User = require("../models/User.js");
const Tweet = require("../models/Tweets.js");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

// Attachment storage
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
    file.mimetype === "image/gif" ||
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

tweetsrouter.post("/test", upload.single("tweetAttachment"), (req, res) => {
  console.log("called");
  console.log(req.file);
});

tweetsrouter.get("/", async (req, res) => {
  Tweet.find({ isReply: false })
    .sort({ createdAt: -1 })
    .then((tweets) => res.send(tweets))
    .catch((err) => console.log(err.message));
});

tweetsrouter.get("/tweet/:id", async (req, res) => {
  console.log("here");
  if (req.params.id != "undefined") {
    Tweet.find({ _id: req.params.id })
      .then((tweet) => {
        res.send(tweet[0]);
      })
      .catch((err) => console.log(err.message));
  }
});

tweetsrouter.get("/:id", (req, res) => {
  const filter = req.params.id
    ? { user: req.params.id, isReply: false }
    : { isReply: false };
  Tweet.find(filter)
    .sort({ createdAt: -1 })
    .then((tweets) => {
      res.send(tweets);
    })
    .catch((err) => res.send(err.message));
});

tweetsrouter.get("/replies/:id/:count", (req, res) => {
  if (req.params.count == 0) {
    res.send([]);
    return;
  }
  let replies = [];
  Tweet.findById(req.params.id)
    .then((tweet) => {
      tweet?.replies.forEach((reply) => {
        Tweet.findById(reply)
          .then((replyTweet) => {
            replies.push(replyTweet);
            if (replies.length >= req.params.count) res.send(replies);
          })
          .catch((err) => res.send(err.message));
      });
    })
    .catch((err) => res.send(500));
});
const deleteReplies = (tweet) => {
  Tweet.findByIdAndDelete(tweet._id)
    .then(() => {})
    .catch((err) => console.log(err));
  if (tweet.repliesCount > 0) {
    tweet.replies.forEach((reply) => {
      Tweet.findById(reply)
        .then((rep) => deleteReplies(rep))
        .catch((err) => res.send(err.message));
    });
  }
};
tweetsrouter.post("/delete", (req, res) => {
  Tweet.findById(req.body.id)
    .then((tweet) => {
      User.findOneAndUpdate(
        { _id: tweet.user },
        { $pull: { tweets: tweet._id } },
        { new: true },
        (err) => {
          if (err) {
            res.send(err.message);
            console.log("Something wrong when posting the data!");
          }
        }
      );

      Tweet.findOneAndUpdate(
        { _id: req.body.parent },
        {
          $inc: { repliesCount: -1 },
          $pull: { replies: tweet._id },
        },
        { new: true },
        (err) => {
          if (err) {
            res.send(err.message);
            console.log("Something wrong when posting the data!");
          }
        }
      );
      deleteReplies(tweet);
    })

    .then(res.sendStatus(200))
    .catch((err) => console.log(err.message));
});

tweetsrouter.post("/reply/:id", (req, res) => {
  new Tweet({
    user: req.body.id,
    content: req.body.content,
    date: req.body.date,
    isReply: req.body.reply,
    parent: req.body.parent,
  })
    .save()
    .then((tweet) => {
      User.findOneAndUpdate(
        { _id: tweet.user },
        { $addToSet: { tweets: tweet._id } },
        { new: true },
        (err) => {
          if (err) {
            res.send(err.message);
            console.log("Something wrong when posting the data!");
          }
        }
      );
      Tweet.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { repliesCount: 1 },
          $addToSet: { replies: tweet._id },
        },
        { new: true },
        (err) => {
          if (err) {
            console.log("Something wrong when posting the data!");
          }
        }
      );
    })
    .then(() => {
      res.sendStatus(200);
    });
});
tweetsrouter.post("/unlike", (req, res) => {
  const payload = req.body.liked
    ? {
        $inc: { liked: -1 },
        $pull: { likedBy: req.body.user.id },
      }
    : { $inc: { likes: 1 }, $addToSet: { likedBy: req.body.user._id } };
  Tweet.findOneAndUpdate(
    { _id: req.body.id },
    { $inc: { likes: -1 }, $pull: { likedBy: req.body.user._id } },
    { new: true },
    (err) => {
      if (err) {
        console.log("Something wrong when posting the data!");
      }
    }
  );
  res.sendStatus(200);
});

tweetsrouter.post("/like", (req, res) => {
  const payload = req.body.liked
    ? {
        $inc: { likes: -1 },
        $pull: { likedBy: req.body.user._id },
      }
    : { $inc: { likes: 1 }, $addToSet: { likedBy: req.body.user._id } };
  Tweet.findOneAndUpdate(
    { _id: req.body.id },
    payload,
    { new: true },
    (err) => {
      if (err) {
        console.log("Something wrong when posting the data!");
      }
    }
  );
  res.sendStatus(200);
});
tweetsrouter.post("/post", upload.single("tweetAttachment"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  /*
  new Tweet({
    user: req.body.id,
    content: req.body.content,
    date: req.body.date,
  })
    .save()
    .then((tweet) => {
      User.findOneAndUpdate(
        { _id: tweet.user },
        { $addToSet: { tweets: tweet._id } },
        { new: true },
        (err) => {
          if (err) {
            console.log("Something wrong when posting the data!");
          }
        }
      );
    })
    .then(res.send("ok"));*/
});
module.exports = tweetsrouter;
