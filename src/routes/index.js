const router = require("express").Router();
const User = require("../database/models/User");
const Class = require("../database/models/Class");
const Post = require("../database/models/Post");

const {
    ensureAuth,
    ensureGuest,
    ensureTeacher,
    ensureAccessToClass,
    ensurePriaveClass,
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
        users: await User.find({}),
    });
});

router.get(
    "/classes/:id",
    ensureAccessToClass,
    ensureAuth,
    async (req, res) => {
        Class.findById({ _id: req.params.id }, async (err, classData) => {
            if (classData === null || !classData) {
                res.redirect(
                    "/classes?error=true&error_id=1&error_message=Class not found!"
                );
            } else {
                res.render("classes/show", {
                    isLoggedIn: req.isAuthenticated(),
                    user: req.user,
                    teacher: await User.findById({ _id: classData.teacher }),
                    students: await User.find({
                        _id: { $in: classData.students },
                    }),
                    classData: classData,
                    posts: await Post.find({ class: classData._id }),
                });
            }
        });
    }
);

router.get(
    "/classes/:id/settings",
    ensureTeacher,
    ensureAuth,
    async (req, res) => {
        Class.findById({ _id: req.params.id }, async (err, classData) => {
            if (classData === null || !classData) {
                res.redirect(
                    "/classes?error=true&error_id=1&error_message=Class not found!"
                );
            } else {
                res.render("classes/settings", {
                    isLoggedIn: req.isAuthenticated(),
                    user: req.user,
                    teacher: await User.findById({ _id: classData.teacher }),
                    students: await User.find({
                        _id: { $in: classData.students },
                    }),
                    classData: classData,
                });
            }
        });
    }
);

router.get(
    "/classes/:id/join",
    ensurePriaveClass,
    ensureAuth,
    async (req, res) => {
        Class.findByIdAndUpdate(
            { _id: req.params.id },
            { $push: { students: [req.user._id] } },
            { new: true },
            (err, classData) => {
                if (err) {
                    res.redirect(
                        "/classes?error=true&error_id=3&error_message=Error joining class"
                    );
                } else {
                    res.redirect(
                        "/classes/" +
                            classData._id +
                            "?success=true&success_message=You have successfully joined the class"
                    );
                }
            }
        );
    }
);

router.post("/classes/new", ensureTeacher, ensureAuth, async (req, res) => {
    let { name, description, image, students, private, maxStudents } = req.body;

    if (private == undefined) {
        private = "off";
    }

    if (maxStudents == undefined) {
        maxStudents = "30";
    }

    const newClass = new Class({
        name,
        description,
        image,
        teacher: req.user._id,
        students: students,
        private,
        maxStudents,
    });

    await newClass.save();

    res.redirect(`/classes/${newClass._id}`);
});

router.post("/classes/new/post", ensureAuth, async (req, res) => {
    const { title, content, classid } = req.body;

    const newPost = new Post({
        title,
        content,
        user: [req.user.name, req.user._id, req.user.avatar, req.user.uid],
        class: classid,
    });

    await newPost.save();
    res.redirect(`/classes/${classid}?post=${newPost._id}`);
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
