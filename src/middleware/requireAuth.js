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

    ensureGuest: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            return next();
        }
    },
};
