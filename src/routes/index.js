const router = require("express").Router();
const User = require("../database/models/User");
const Class = require("../database/models/Class");

const {
    ensureAuth,
    ensureGuest,
    ensureTeacher,
} = require("../middleware/requireAuth");

router.get("/", ensureGuest, (req, res) => {
    res.render("index", {
        isLoggedIn: req.isAuthenticated(),
        user: req.user,
    });
});

// Classes
router.get("/classes/new", ensureTeacher, ensureAuth, async (req, res) => {
    res.render("classes/new", {
        isLoggedIn: req.isAuthenticated(),
        user: req.user,
        users: await User.find({ role: 0 }),
    });
});

router.get("/classes/:id", ensureAuth, async (req, res) => {
    Class.findById({ _id: req.params.id }, async (err, classData) => {
        if (classData === null || !classData) {
            res.redirect(
                "/classes?error=true&error_id=1&error_message=Class not found!"
            );
        } else {
            res.render("classes/show", {
                isLoggedIn: req.isAuthenticated(),
                user: req.user,
                classData: classData,
            });
        }
    });
});

router.post("/classes/new", ensureTeacher, ensureAuth, async (req, res) => {
    const { name, description, image, students } = req.body;

    const newClass = new Class({
        name,
        description,
        image,
        teacher: req.user._id,
        students: students,
    });

    console.table(newClass);
    await newClass.save();
    res.redirect(`/classes/${newClass._id}`);
});

router.get("/classes", ensureAuth, async (req, res) => {
    res.render("classes/index", {
        isLoggedIn: req.isAuthenticated(),
        user: req.user,
        teacherClasses: await Class.find({ teacher: req.user._id }),
        studentClasses: await Class.find({ students: req.user.id }),
    });
});

module.exports = router;
