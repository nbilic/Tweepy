const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const dbConnect = require("./config/dbConnect.js");
const app = express();
const authrouter = require("./routes/auth.js");
const tweetrouter = require("./routes/tweets.js");
const userrouter = require("./routes/user");
dbConnect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use("/uploads", express.static("uploads"));
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);
app.use("/auth", authrouter);
app.use("/api/tweets", tweetrouter);
app.use("/api/user", userrouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`"Up on 4000"`));
