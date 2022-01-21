const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default:
        "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png",
    },
    handle: {
      type: String,
      default: `${this.username}`,
    },
    password: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    tweets: [],
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
