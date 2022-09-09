module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect(
                "/?returnURL=" +
                    req.originalUrl +
                    "&message=You must be logged in to access the page"
            );
        }
    },

    ensureLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect("/dashboard");
        } else {
            return next();
        }
    },

    ensureTeacher: function (req, res, next) {
        if (req.isAuthenticated() && req.user.role == 5) {
            return next();
        } else {
            res.redirect("/?error=You must be a teacher to access this page");
        }
    },

    enIsTeacher: function (req, res, next) {
        const Class = require("../database/models/Class");

        Class.findById(req.params.id, async (err, classData) => {
            if (classData === null || !classData) {
                res.redirect(
                    "/classes?error=true&error_id=1&error_message=Class not found!"
                );
            } else {
                if (classData.teacher == req.user.id) {
                    return next();
                } else {
                    res.redirect(
                        "/?error=You must be a teacher to access this page"
                    );
                }
            }
        });
    },

    ensureAccessToClass: function async(req, res, next) {
        const Class = require("../database/models/Class");

        Class.findById({ _id: req.params.id }, async (err, classData) => {
            if (classData === null || !classData) {
                res.redirect(
                    "/classes?error=true&error_id=1&error_message=Class not found!"
                );
            } else {
                if (classData.students.includes(req.user._id)) {
                    return next();
                } else {
                    res.redirect(
                        "/classes?error=true&error_id=2&error_message=You do not have access to this class"
                    );
                }
            }
        });
    },

    ensurePriaveClass: function async(req, res, next) {
        const Class = require("../database/models/Class");

        Class.findById({ _id: req.params.id }, async (err, classData) => {
            if (classData === null || !classData) {
                res.redirect(
                    "/classes?error=true&error_id=1&error_message=Class not found!"
                );
            } else {
                if (classData.private == "on") {
                    res.redirect(
                        "/classes?error=true&error_id=2&error_message=This class is private"
                    );
                } else {
                    return next();
                }
            }
        });
    },

    ensureAdmin: function async(req, res, next) {
        if (req.user.site_admin == true) {
            return next();
        } else {
            res.redirect("/classes");
        }
    },

    ensureGuest: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            return next();
        }
    },
};
