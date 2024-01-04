const express = require("express");
const Comment = require("../model/comment");
const Question = require("../model/question");
const { checkUser } = require("../auth");

const router = express.Router();

const upvote = async (req, res) => {
    const cid = req.body.cid;
    const qid = req.body.qid;

    const c = await Comment.findOneAndUpdate(
        { _id: cid },
        { $inc: { voted: 1 } },
        { new: true }
    );

    if (!c || !c._id) {
        res.status(400);
        res.json({ errmsg: "Cannot find the comment" });
        return;
    }

    const q = await Question.findOneAndUpdate(
        { _id: qid },
        { updatedAt: Date.now() }
    );

    res.status(200);
    res.json({ cid: c._id, qid: q._id });
};

router.post("/upvote", checkUser, upvote);

module.exports = router;
