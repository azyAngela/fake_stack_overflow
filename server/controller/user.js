const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const router = express.Router();

const { saltRounds, JWT_SECRET } = require("../config");
const { checkUser } = require("../auth");

const register = async (req, res) => {
    const userinfo = req.body;
    const usr1 = await User.findOne({ username: userinfo.username });
    if (usr1) {
        res.status(400);
        res.json({ type: "username", errmsg: "Username is already taken" });
        return;
    }
    const usr2 = await User.findOne({ email: userinfo.email });
    if (usr2) {
        res.status(400);
        res.json({ type: "email", errmsg: "Email is already taken" });
        return;
    }

    bcrypt.hash(userinfo.password, saltRounds, async (err, hash) => {
        if (err) {
            res.status(400);
            res.json({ errmsg: "Something wrong in the server" });
            return;
        }
        userinfo.password = hash;
        const ans = await User.create(userinfo);
        res.status(200);
        res.json({ _id: ans._id });
    });
};

const login = async (req, res) => {
    const userinfo = req.body;
    const usr = await User.findOne({ username: userinfo.username });
    if (!usr) {
        res.status(400);
        res.json({ errmsg: `User ${userinfo.username} not exists` });
        return;
    }
    bcrypt.compare(userinfo.password, usr.password, (err, result) => {
        if (err) {
            res.status(400);
            res.json({ errmsg: "Something wrong in the server" });
            return;
        }
        if (!result) {
            res.status(400);
            res.json({ errmsg: "Wrong password" });
        } else {
            res.status(200);
            req.session.user = usr._id;
            const usrinfo = { _id: usr._id, username: usr.username };
            const token = jwt.sign(usrinfo, JWT_SECRET);
            res.json({ username: usr.username, token: token });
        }
    });
};

const logout = async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
};

const getUserInfo = async (req, res) => {
    const usr = await User.findById(req.session.user).select(
        "username email createdAt reputation"
    );

    res.json(usr);
};

const editUserInfo = async (req, res) => {
    const userinfo = req.body;
    const usr = await User.findById(req.session.user);
    if (usr.username !== userinfo.username) {
        const usr1 = await User.findOne({ username: userinfo.username });
        if (usr1) {
            res.status(400);
            res.json({ type: "username", errmsg: "Username is already taken" });
            return;
        }
    }
    if (usr.email !== userinfo.email) {
        const usr1 = await User.findOne({ email: userinfo.email });
        if (usr1) {
            res.status(400);
            res.json({ type: "email", errmsg: "Email is already taken" });
            return;
        }
    }

    if (usr.username === userinfo.username && usr.email === userinfo.email) {
        res.status(200);
        res.json({ username: usr.username, email: usr.email });
        return;
    }

    const newusr = await User.findOneAndUpdate({ _id: usr._id }, userinfo, {
        new: true,
    });

    res.status(200);
    res.json({ username: newusr.username, email: newusr.email });
};

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getUserInfo", checkUser, getUserInfo);
router.put("/editUserInfo", checkUser, editUserInfo);

module.exports = router;
