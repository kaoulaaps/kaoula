require("dotenv").config();
const router = require("express").Router();
const Class = require("../database/models/Class")

router.get("/classes",  async (req,res) => {
   
        Class.find({}, (err, data) => {
            const filteredData = data.map((d) => {
                return {
                    id: d.classId,
                    name: d.name,
                    description: d.description,
                    teacher: d.teacher.uid,
                    students: d.students.length,
                    private: d.private,
                    maxStudents: d.maxStudents,
                };
            });
            res.send(filteredData);
        });
 
})

module.exports = router;
