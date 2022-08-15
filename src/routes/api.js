require("dotenv").config();
const router = require("express").Router();
const Class = require("../database/models/Class");
const User = require("../database/models/User");

router.get("/classes", async (req, res) => {
    Class.find({}, (err, data) => {
        const filteredData = data.map((d) => {
            return {
                id: d.classId,
                name: d.name,
                description: d.description,
                teacher: d.teacher,
                students: d.students.length,
                private: d.private,
                maxStudents: d.maxStudents,
            };
        });
        res.send(filteredData);
    });
});

router.get("/users", async (req, res) => {
    const token = process.env.API_TOKEN;
    const tokenUri = req.query.token;

    if (tokenUri !== token) {
        res.send({
            error: true,
            status: 401,
            message: "Invalid token",
        });
    } else if (!tokenUri) {
        res.send({
            error: true,
            status: 401,
            message: "No token provided",
        });
    } else {
        User.find({}, (err, data) => {
            const filteredData = data.map((d) => {
                return {
                    id: d.uid,
                    name: d.name,
                    avatar: d.avatar,
                    provider: d.provider,
                };
            });
            res.send(filteredData);
        });
    }
});

module.exports = router;
