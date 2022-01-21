const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    repliesCount: {
      type: Number,
      default: 0,
    },
    replies: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Tweet",
    },
    isReply: {
      type: Boolean,
      default: 0,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
    attachment: {
      url: String,
    },
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
