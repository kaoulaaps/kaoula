require("dotenv").config();
require("./src/database/connect");
require("./src/utils/passport-google");
const express = require("express");
const path = require("path");
const app = express();
const chalk = require("chalk");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

//  Middlewares & Sessions
// Settings & Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
app.use(bodyParser.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(
    cors({
        origin: ["http://localhost:2000", "https://kaoula.fly.dev"],
        credentials: true,
    })
);

app.use(
    session({
        secret: "something",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            ttl: 24 * 60 * 60,
        }),
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
const apiRouter = require("./src/routes/api");
const authRouter = require("./src/routes/auth");
const indexRouter = require("./src/routes/index");

// Use Routes
app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/", indexRouter);

// Start server
app.listen(PORT, () => {
    console.log(`💻 Server is running on port ${chalk.redBright(PORT)}`);
});
