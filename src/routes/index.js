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

// Fix routes
router.get("/profile", ensureAuth, async (req, res) => {
    res.redirect("/profile/" + req.user.uid);
});

// New class registration
router.get("/classes/new", ensureTeacher, ensureAuth, async (req, res) => {
    res.render("classes/new", {
        isLoggedIn: req.isAuthenticated(),
        user: req.user,
        users: await User.find({}),
    });
});

// Show class
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

// Render settings page
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
                    users: await User.find({}),
                    classData: classData,
                    actions: {
                        edit: req.query.action === "EDIT",
                        manage_students: req.query.action === "MANAGE_STUDENTS",
                        new_student: req.query.action === "NEW_STUDENT",
                        delete_class: req.query.action === "DELETE_CLASS",
                    },
                });
            }
        });
    }
);

// Delete class
router.post(
    "/classes/:id/delete",
    ensureTeacher,
    ensureAuth,
    async (req, res) => {
        Class.findByIdAndDelete(
            { _id: req.params.id },
            async (err, classData) => {
                if (classData === null || !classData) {
                    res.redirect(
                        "/classes?error=true&error_id=1&error_message=Class not found!"
                    );
                } else {
                    res.redirect(
                        "/classes?success=true&success_id=1&success_message=Class deleted successfully!"
                    );
                }
            }
        );
    }
);

// Join new class
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

// Remove student from class
router.post(
    "/classes/:id/removeMember",
    ensureTeacher,
    ensureAuth,
    async (req, res) => {
        Class.findByIdAndUpdate(
            { _id: req.params.id },
            { $pull: { students: req.body.uid } },
            { new: true },
            (err, classData) => {
                if (err) {
                    res.redirect(
                        "/classes?error=true&error_id=3&error_message=Error removing student"
                    );
                } else {
                    res.redirect(
                        "/classes/" +
                            classData._id +
                            "?success=true&success_message=Student removed from class"
                    );
                }
            }
        );
    }
);

// New class
router.post("/classes/new", ensureTeacher, ensureAuth, async (req, res) => {
    let { name, description, image, students, private, maxStudents } = req.body;

    if (private == undefined) {
        private = "off";
    }

    if (maxStudents == undefined) {
        maxStudents = "30";
    }

    if (!maxStudents) {
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

// New class post
router.post("/classes/new/post", ensureAuth, async (req, res, next) => {
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

// Update a class
router.post(
    "/classes/new/update",
    ensureTeacher,
    ensureAuth,
    async (req, res, next) => {
        const { name, description, maxStudents } = req.body;

        if (maxStudents == undefined) {
            maxStudents = "30";
        }

        if (!maxStudents) {
            maxStudents = "30";
        }

        try {
            Class.findByIdAndUpdate(
                { _id: req.body.classId },
                {
                    name,
                    description,
                    maxStudents,
                },
                { new: true },
                (err, classData) => {
                    if (err) {
                        res.redirect(
                            "/classes?error=true&error_id=3&error_message=Error updating class"
                        );
                    } else {
                        res.redirect(
                            "/classes/" +
                                classData._id +
                                "?success=true&success_message=You have successfully updated the class"
                        );
                    }
                }
            );
        } catch (error) {
            res.send({
                error: true,
                error_id: 3,
                error_message: error.message,
            });

            next();
        }
    }
);

// Update classes students
router.post(
    "/classes/new/update/students",
    ensureTeacher,
    ensureAuth,
    async (req, res, next) => {
        const { students } = req.body;

        try {
            Class.findByIdAndUpdate(
                { _id: req.body.classId },
                { students },
                { new: true },
                (err, classData) => {
                    if (err) {
                        res.redirect(
                            "/classes?error=true&error_id=3&error_message=Error updating class&psg=" +
                                err.message
                        );
                    } else {
                        res.redirect(
                            "/classes/" +
                                classData._id +
                                "?success=true&success_message=You have successfully updated the class"
                        );
                    }
                }
            );
        } catch (error) {
            res.send({
                error: true,
                error_id: 3,
                error_message: error.message,
            });
        }
    }
);

router.get("/classes", ensureAuth, async (req, res) => {
    res.render("classes/index", {
        isLoggedIn: req.isAuthenticated(),
        user: req.user,
        teacherClasses: await Class.find({ teacher: req.user._id }),
        studentClasses: await Class.find({ students: req.user.id }),
    });
});

// Profile Routes
router.get("/profile/:id", ensureAuth, async (req, res) => {
    const user = await User.findOne({ uid: req.params.id });

    if (!user) {
        res.redirect("/");
    } else {
        res.render("profile", {
            isLoggedIn: req.isAuthenticated(),
            user: req.user,
            profileUser: user,
        });
    }
});

// Errors
// 404
router.get("*", (req, res) => {
    res.render("errors/404");
});

module.exports = router;
