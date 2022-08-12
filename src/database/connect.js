const mongoose = require("mongoose");
const chalk = require("chalk");

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.info(`${chalk.blueBright("✅ MongoDB")} connected.`);
    }
);
