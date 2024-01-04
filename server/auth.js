const jwt = require("jsonwebtoken");
const User = require("./model/user");
const { JWT_SECRET } = require("./config");

const checkUser = async (req, res, next) => {
    if (!req.session || !req.session.user) {
        res.status(400);
        res.json({ errmsg: "Please login first" });
    } else {
        const uid = req.session.user;
        const user = await User.findById(uid);
        const token = req.header("Authorization");
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                res.status(400);
                res.json({ errmsg: "Token verify error" });
            } else {
                const duid = decoded._id;
                const dusername = decoded.username;
                if (duid !== uid || dusername !== user.username) {
                    res.status(400);
                    res.json({ errmsg: "Login info error, please re-login" });
                } else {
                    next();
                }
            }
        });
    }
};

module.exports = { checkUser };
