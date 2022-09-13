const mongoose = require("mongoose");
const chalk = require("chalk");
const Logger = require("../utils/Logger");

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        new Logger("INFO").log("Database connection connected");
    }
);
