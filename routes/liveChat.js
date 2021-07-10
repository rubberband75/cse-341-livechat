const express = require("express");
const router = express.Router();

const users = ["admin"]; // Dummy array for users

router.get("/", (req, res, next) => {
    res.render("pages/pr12-login", {
        title: "Prove Activity 12",
        path: "/proveActivities/12",
    });
});

// Verify login submission to access chat room.
router.post("/login", (req, res, next) => {
    let username = req.body.username;
    username = username.trim();

    if (!username) {
        return res.status(400).json({ error: "Username Cannot Be Blank" });
    }

    if (users.some((u) => u === username)) {
        return res.status(400).json({ error: "Username Already Taken" });
    }

    users.push(username);
    req.session.username = username;

    return res.json({ status: 'success', username: username });
});

// Render chat screen.
router.get("/chat", (req, res, next) => {
    res.render("pages/pr12-chat", {
        title: "Prove Activity 12",
        path: "/proveActivities/12",
        user: req.session.username
    });
});

module.exports = router;
