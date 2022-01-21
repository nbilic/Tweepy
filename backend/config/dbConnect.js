const mongoose = require("mongoose");
require("dotenv").config();
module.exports = dbConnect = () => {
  mongoose.connect(
    process.env.DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("Connected to the database");
    }
  );
};
