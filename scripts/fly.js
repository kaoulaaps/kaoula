#!/usr/bin/env node

"use strict";

const inquirer = require("inquirer");
const chalk = require("chalk");
const child_process = require("child_process");

const questions = [
    {
        type: "list",
        name: "action",
        message: "⚙️ What do you want to do?",
        choices: ["Deploy", "Set New Secret Variable"],
    },
];

inquirer.prompt(questions).then((answers) => {
    switch (answers.action) {
        case "Deploy":
            console.log(chalk.green("📦 Deploying..."));
            try {
                child_process.execSync("flyctl deploy", { stdio: "inherit" });
            } catch (error) {
                console.log(chalk.red(error.message));
            }
            break;
        case "Set New Secret Variable":
            console.log(chalk.green("Setting new secret variable..."));
            // new question
            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "secret",
                        message: "🍺 What is the name of the secret variable?",
                    },

                    {
                        type: "input",
                        name: "value",
                        message: "🍺 What is the value of the secret variable?",
                    },
                ])
                .then((answers) => {
                    try {
                        child_process.execSync(
                            `flyctl secrets set ${answers.secret}=${answers.value}`,
                            { stdio: "inherit" }
                        );

                        console.log(chalk.green("✅ Secret variable set!"));
                    } catch (error) {
                        console.log(chalk.red(error.message));
                    }
                });

            break;
    }
});
