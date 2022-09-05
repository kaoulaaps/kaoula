const router = require("express").Router();
const User = require("../database/models/User");
const Class = require("../database/models/Class");
const Post = require("../database/models/Post");
const Thread = require("../database/models/Thread");
const Message = require("../database/models/Message");
const Homework = require("../database/models/Homework");
const { generate } = require("yourid");
const Moment = require("moment");

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
                    posts: await Post.find({ class: classData._id }).sort({
                        createdAt: -1,
                    }),
                });
            }
        });
    }
);

// Show homework
router.get(
    "/classes/:id/homework",
    ensureAccessToClass,
    ensureAuth,
    async (req, res) => {
        Class.findById({ _id: req.params.id }, async (err, classData) => {
            if (classData === null || !classData) {
                res.redirect(
                    "/classes?error=true&error_id=1&error_message=Class not found!"
                );
            } else {
                res.render("classes/homework", {
                    isLoggedIn: req.isAuthenticated(),
                    user: req.user,
                    teacher: await User.findById({ _id: classData.teacher }),
                    students: await User.find({
                        _id: { $in: classData.students },
                    }),
                    classData: classData,
                    homework: await Homework.find({ class: classData._id }),
                    today: Moment().format("YYYY-MM-DD"),
                });

                console.log(`Date today: ${Moment().format("YYYY-MM-DD")}`);
            }
        });
    }
);

// Delete a homework
router.post(
    "/homework/:id/delete",
    ensureAuth,
    ensureTeacher,
    async (req, res) => {
        const { id } = req.params;

        const find = await Homework.findById(id);

        if (find === null || !find) {
            res.redirect("/classes?error=Homework not found");
        } else if (find.teacher !== req.user.id) {
            res.redirect(
                "/classes?error=Your Dont Have Permisions to delete this homework"
            );
        } else {
            await Homework.findByIdAndDelete(find.id);
            res.redirect("/classes?msg=Homework deleted");
        }
    }
);
// Edit
router.get("/homework/:id/edit", ensureAuth, async (req, res) => {
    const Work = await Homework.findById({ _id: req.params.id });

    if (req.user.id !== Work.teacher) {
        res.redirect("/");
    } else if (!Work) {
        res.redirect("/");
    } else {
        res.render("classes/editHomework", {
            isLoggedIn: req.isAuthenticated(),
            user: req.user,
            work: Work,
        });
    }
});

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
                        homework: req.query.action === "HOMEWORK",
                        no_action_selcted: !req.query.action,
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
        students: [req.user._id],
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

// New Homework
router.post(
    "/classes/new/homework",
    ensureTeacher,
    ensureAuth,
    async (req, res, next) => {
        const { title, description, subject, dueDate, classId } = req.body;

        const newHomework = new Homework({
            title,
            description,
            subject,
            teacher: req.user._id,
            class: classId,
            dueDate,
        });

        await newHomework.save();
        res.redirect(
            `/classes/${classId}?homework=${newHomework._id}&psg=setTrueToFalse`
        );
    }
);

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
    "/classes/new/update/invite",
    ensureTeacher,
    ensureAuth,
    async (req, res) => {
        let { uid } = req.body;

        let userId = await User.findOne({ uid: uid });

        if (userId) {
            Class.findByIdAndUpdate(
                { _id: req.body.class_id },
                { $push: { students: userId._id } },
                { new: true },
                (err, classData) => {
                    if (err) {
                        res.redirect(
                            "/classes?error=true&error_id=3&error_message=Error inviting student&psg=" +
                                err.message
                        );
                    } else {
                        res.redirect(
                            "/classes/" +
                                classData._id +
                                "?success=true&success_message=Student invited successfully"
                        );
                    }
                }
            );
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
            formatUserBirthdayToDanish: Moment(user.birthday)
                .locale("da")
                .format("DD/MM/YYYY"),
        });
    }
});

// Edit
router.get("/profile/:id/edit", ensureAuth, async (req, res) => {
    const user = await User.findOne({ uid: req.params.id });

    if (req.user.uid != user.uid) {
        res.redirect("/");
    } else if (!user) {
        res.redirect("/");
    } else {
        res.render("edit", {
            isLoggedIn: req.isAuthenticated(),
            user: req.user,
            profileUser: user,
        });
    }
});
// Update
router.post("/profile/:id/update", ensureAuth, async (req, res) => {
    const { name, email, phone, birthday } = req.body;

    const user = await User.findOne({ uid: req.params.id });

    if (req.user.uid != user.uid) {
        res.redirect("/");
    } else if (!user) {
        res.redirect("/");
    } else {
        user.name = name;
        user.email = email;
        user.phone = phone;
        user.birthday = birthday;
        await user.save();
        res.redirect("/profile/" + user.uid);
    }
}),
    // Messages
    // Render new message form
    router.get("/messages/new", ensureAuth, async (req, res) => {
        res.render("messages/new", {
            isLoggedIn: req.isAuthenticated(),
            user: req.user,
            users: await User.find({}),
        });
    });

// Create Message
router.post("/messages/new/thread", ensureAuth, async (req, res) => {
    const { title, subject, users } = req.body;

    const newThread = new Thread({
        tid: generate({
            length: 15,
            keyspace: "012345678910012345678910012345678910",
        }),
        title,
        subject,
        users,
    });

    await newThread.save();
    res.redirect(`/messages/t/${newThread._id}`);
}),
    // Create new Message
    router.post("/messages/new", ensureAuth, async (req, res) => {
        let { content, tid } = req.body;

        const newMessage = new Message({
            content,
            tid,
            user: [req.user.name, req.user._id, req.user.avatar, req.user.uid],
        });

        await newMessage.save();
        res.redirect(`/messages/t/${tid}`);
    });

// Render Thread
router.get("/messages/t/:id", ensureAuth, async (req, res) => {
    const thread = await Thread.findById(req.params.id);

    if (!thread) {
        res.redirect("/");
    } else if (thread.users.includes(req.user.id)) {
        res.render("messages/index", {
            isLoggedIn: req.isAuthenticated(),
            user: req.user,
            thread: thread,
            threadUser: await User.find({
                _id: { $in: thread.users },
            }),
            messages: await Message.find({ tid: req.params.id }),
        });
    } else {
        res.redirect("/");
    }
}),
    // Message List
    router.get("/messages", ensureAuth, async (req, res) => {
        res.render("messages/list", {
            isLoggedIn: req.isAuthenticated(),
            user: req.user,
            threads: await Thread.find({ users: req.user.id }),
        });
    });

// Delete Message
router.post("/messages/delete", ensureAuth, async (req, res) => {
    const msg = await Message.findById(req.body.mid);

    if (req.user.uid != msg.user[3]) {
        res.redirect("/");
    } else {
        await Message.findByIdAndDelete(req.body.mid);
        res.redirect(
            `/messages/t/${msg.tid}?success=true&success_message=Message deleted`
        );
    }
});

// Errors
// The /classData error
router.get("/classData", (req, res) => {
    res.redirect("/classes");
});
// 404
router.get("*", (req, res) => {
    res.render("errors/404");
});

module.exports = router;
