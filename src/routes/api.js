require("dotenv").config();
const router = require("express").Router();
const Class = require("../database/models/Class")

router.get("/classes",  async (req,res) => {
    const classes = Class.find({})

    res.send(classes)
})

module.exports = router;
