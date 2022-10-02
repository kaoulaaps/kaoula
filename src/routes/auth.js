const router = require("express").Router();
const passport = require("passport");
const User = require("../database/models/User");

router.get("/", (req, res) => {
    res.send(200);
});

// Google Auth

router.get("/google", passport.authenticate("google"));
router.get("/github", (req, res) => {
    res.redirect("/auth/google");
});

router.get(
    "/google/callback",
    passport.authenticate(
        "google",

        {
            failureRedirect:
                "/?error=true&error_id=1&error_message=Login failed!",
        }
    ),
    function (req, res) {
        res.redirect("/classes");
    }
);

// Account Management

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.get("/delete", (req, res) => {
    User.findOneAndDelete({ _id: req.user._id }, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

module.exports = router;
