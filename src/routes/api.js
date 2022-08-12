require("dotenv").config();
const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("Welcome to the API");
});

module.exports = router;
