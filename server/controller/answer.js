const express = require("express");
const Answer = require("../model/answer");
const Question = require("../model/question");
const User = require("../model/user");
const Comment = require("../model/comment");
const { checkUser } = require("../auth");

const router = express.Router();

const upvote = async (req, res) => {
    const qid = req.body.qid;
    const aid = req.body.aid;
    const uid = req.session.user;
    const user = await User.findById(uid);

    if (user.reputation < 50) {
        res.status(400);
        res.json({
            errmsg: "Only user with 50 or higher reputation could vote",
        });
        return;
    }

    const q = await Question.findOneAndUpdate(
        { _id: qid },
        { updatedAt: Date.now() }
    );

    if (!q || !q._id) {
        res.status(400);
        res.json({ errmsg: "Cannot find the question" });
        return;
    }

    const a = await Answer.findOneAndUpdate(
        { _id: aid },
        { $inc: { voted: 1 } },
        { new: true }
    );

    const ans_usr = a.ans_by;

    if (!a || !a._id) {
        res.status(400);
        res.json({ errmsg: "Cannot find the answer" });
        return;
    }

    await User.findOneAndUpdate(
        { _id: ans_usr },
        { $inc: { reputation: 5 } },
        { new: true }
    );

    res.status(200);
    res.json({ aid: a._id, qid: q._id });
};

const downvote = async (req, res) => {
    const qid = req.body.qid;
    const aid = req.body.aid;
    const uid = req.session.user;
    const user = await User.findById(uid);

    if (user.reputation < 50) {
        res.status(400);
        res.json({
            errmsg: "Only user with 50 or higher reputation could vote",
        });
        return;
    }

    const q = await Question.findOneAndUpdate(
        { _id: qid },
        { updatedAt: Date.now() }
    );

    if (!q || !q._id) {
        res.status(400);
        res.json({ errmsg: "Cannot find the question" });
        return;
    }

    const a = await Answer.findOneAndUpdate(
        { _id: aid },
        { $inc: { voted: -1 } },
        { new: true }
    );

    const ans_usr = a.ans_by;

    if (!a || !a._id) {
        res.status(400);
        res.json({ errmsg: "Cannot find the answer" });
        return;
    }

    await User.findOneAndUpdate(
        { _id: ans_usr },
        { $inc: { reputation: -10 } },
        { new: true }
    );

    res.status(200);
    res.json({ aid: a._id, qid: q._id });
};

const postComment = async (req, res) => {
    const qid = req.body.qid;
    const aid = req.body.aid;
    const text = req.body.text;
    const uid = req.session.user;
    const user = await User.findById(uid);
    if (user.reputation < 50) {
        res.status(400);
        res.json({
            errmsg: "Only user with 50 or higher reputation could comment",
        });
        return;
    }

    const c = await Comment.create({ text, commented_by: uid });
    const cp = await Comment.findById(c._id).populate({
        path: "commented_by",
        model: User,
    });
    await Answer.findOneAndUpdate({ _id: aid }, { $push: { comments: c._id } });

    await Question.findOneAndUpdate({ _id: qid }, { updatedAt: Date.now() });

    res.json(cp);
};

const addAnswer = async (req, res) => {
    const ans = req.body.ans;
    const qid = req.body.qid;
    const uid = req.session.user;
    ans.ans_by = uid;

    const ca = await Answer.create(ans);

    await Question.findOneAndUpdate(
        { _id: qid },
        { $push: { answers: ca._id } }
    );

    res.json({ aid: ca._id });
};

const getUserAnswers = async (req, res) => {
    const uid = req.session.user;
    const al = await Answer.find({ ans_by: uid }).sort({
        createdAt: -1,
    });
    res.json(al);
};

const editAnswer = async (req, res) => {
    const ainfo = req.body;
    const uid = req.session.user;
    const aid = ainfo._id;
    const a = await Answer.findById(aid);
    if (a.ans_by != uid) {
        res.status(400);
        res.json({ errmsg: "Userinfo error, it may not your question" });
        return;
    }

    const updated = { text: ainfo.text };
    const ua = await Answer.findOneAndUpdate({ _id: aid }, updated, {
        new: true,
    });

    await Question.findOneAndUpdate(
        { answers: aid },
        { updatedAt: Date.now() }
    );

    res.json({ aid: ua._id });
};

const deleteAnswer = async (req, res) => {
    const aid = req.params.aid;
    const uid = req.session.user;
    const a = await Answer.findById(aid);

    if (a.ans_by != uid) {
        res.status(400);
        res.json({ errmsg: "Userinfo error, it may not your question" });
        return;
    }

    await Promise.all(
        (a.comments || []).map(async (c) => {
            await Comment.deleteOne({ _id: c });
        })
    );

    const da = await Answer.deleteOne({ _id: aid });

    await Question.findOneAndUpdate(
        { answers: aid },
        { updatedAt: Date.now() }
    );
    if (da) {
        res.sendStatus(200);
    } else {
        res.status(400);
        res.json({ errmsg: "Delete failed!" });
    }
};

router.post("/upvote", checkUser, upvote);
router.post("/downvote", checkUser, downvote);
router.post("/postComment", checkUser, postComment);
router.post("/addAnswer", checkUser, addAnswer);
router.get("/getUserAnswers", checkUser, getUserAnswers);
router.put("/editAnswer", checkUser, editAnswer);
router.delete("/deleteAnswer/:aid", checkUser, deleteAnswer);

module.exports = router;
