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

module.exports = router;
