const express = require("express");
const Tag = require("../model/tag");
const User = require("../model/user");
const Question = require("../model/question");
const Answer = require("../model/answer");
const Comment = require("../model/comment");
const { checkUser } = require("../auth");

const router = express.Router();

const getQuestionsByFilter = async (req, res) => {
    const order = req.query.order || "";
    const search = req.query.search || "";

    let qlist = await Question.find().populate([
        { path: "tags", model: Tag },
        { path: "asked_by", model: User, select: "username" },
    ]);
    if (order == "active") {
        qlist = getActiveQuestion(qlist);
    } else if (order == "unanswered") {
        qlist = getUnansweredQuestion(qlist);
    } else {
        qlist = getNewestQuestion(qlist);
    }

    const searchTags = parseTags(search);
    const searchKeyword = parseKeyword(search);

    const resqlist = qlist.filter((q) => {
        if (searchKeyword.length == 0 && searchTags.length == 0) {
            return true;
        } else if (searchKeyword.length == 0) {
            return checkTagInQuestion(q, searchTags);
        } else if (searchTags.length == 0) {
            return checkKeywordInQuestion(q, searchKeyword);
        } else {
            return (
                checkKeywordInQuestion(q, searchKeyword) ||
                checkTagInQuestion(q, searchTags)
            );
        }
    });

    res.json(resqlist);
};

const addQuestion = async (req, res) => {
    const question = req.body;

    const uid = req.session.user;
    const user = await User.findById(uid);
    question.asked_by = uid;

    let taglist = [];

    for (let i = 0; i < question.tags.length; i++) {
        let name = question.tags[i];
        const t = await Tag.findOne({ name: name });
        if (t) {
            taglist.push(t._id);
        } else {
            if (user.reputation < 50) {
                res.status(400);
                res.json({
                    errmsg: "New tags can only be added by users with reputation of 50 or more.",
                });
                return;
            }
            const newTag = await Tag.create({ name, created_by: uid });
            taglist.push(newTag._id);
        }
    }

    question.tags = taglist;
    const result = await Question.create(question);
    res.json({ _id: result._id });
};

const getQuestionById = async (req, res) => {
    const qid = req.params.qid;
    const q = await Question.findOneAndUpdate(
        { _id: qid },
        { $inc: { views: 1 } },
        { new: true, timestamps: false }
    ).populate([
        { path: "tags", model: Tag },
        {
            path: "answers",
            model: Answer,
            populate: [
                { path: "ans_by", model: User, select: "username" },
                {
                    path: "comments",
                    model: Comment,
                    populate: {
                        path: "commented_by",
                        model: User,
                        select: "username",
                    },
                    options: {
                        sort: { createdAt: -1 },
                    },
                },
            ],
            options: {
                sort: { createdAt: -1 },
            },
        },
        {
            path: "accepted_ans",
            model: Answer,
            populate: [
                { path: "ans_by", model: User, select: "username" },
                {
                    path: "comments",
                    model: Comment,
                    populate: {
                        path: "commented_by",
                        model: User,
                        select: "username",
                    },
                    options: {
                        sort: { createdAt: -1 },
                    },
                },
            ],
        },
        {
            path: "comments",
            model: Comment,
            populate: {
                path: "commented_by",
                model: User,
                select: "username",
            },
            options: {
                sort: { createdAt: -1 },
            },
        },
        { path: "asked_by", model: User, select: "username" },
    ]);

    res.json(q);
};

const upvote = async (req, res) => {
    const qid = req.body.qid;
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
        { $inc: { voted: 1 } },
        { new: true }
    );

    if (!q || !q._id) {
        res.status(400);
        res.json({ errmsg: "Cannot find the question" });
        return;
    }

    const asked_usr = q.asked_by;

    await User.findOneAndUpdate(
        { _id: asked_usr },
        { $inc: { reputation: 5 } },
        { new: true }
    );

    res.status(200);
    res.json({ qid: q._id });
};

const downvote = async (req, res) => {
    const qid = req.body.qid;
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
        { $inc: { voted: -1 } },
        { new: true }
    );

    if (!q || !q._id) {
        res.status(400);
        res.json({ errmsg: "Cannot find the question" });
        return;
    }

    const asked_usr = q.asked_by;

    await User.findOneAndUpdate(
        { _id: asked_usr },
        { $inc: { reputation: -10 } },
        { new: true }
    );

    res.status(200);
    res.json({ qid: q._id });
};

const postComment = async (req, res) => {
    const qid = req.body.qid;
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

    await Question.findOneAndUpdate(
        { _id: qid },
        { $push: { comments: c._id } }
    );

    res.json(cp);
};

const acceptAns = async (req, res) => {
    const qid = req.body.qid;
    const q = await Question.findById(qid);
    if (q.asked_by != req.session.user) {
        res.status(400);
        res.json({ errmsg: "Login info error, please re-login" });
        return;
    }
    const aid = req.body.aid;
    await Question.findOneAndUpdate({ _id: qid }, { accepted_ans: aid });
    const a = await Answer.findById(aid).populate([
        {
            path: "ans_by",
            model: User,
        },
        {
            path: "comments",
            model: Comment,
            populate: {
                path: "commented_by",
                model: User,
                select: "username",
            },
            options: {
                sort: { createdAt: -1 },
            },
        },
    ]);
    res.json(a);
};

const getUserQuestions = async (req, res) => {
    const uid = req.session.user;
    const ql = await Question.find({ asked_by: uid })
        .populate({ path: "tags", model: Tag })
        .sort({ createdAt: -1 })
        .select("title text tags");
    res.json(ql);
};

const editQuestion = async (req, res) => {
    const qinfo = req.body;
    const uid = req.session.user;
    const user = await User.findById(uid);
    const qid = qinfo._id;
    const q = await Question.findById(qid);
    if (q.asked_by != uid) {
        res.status(400);
        res.json({ errmsg: "Userinfo error, it may not your question" });
        return;
    }
    const updated = { title: qinfo.title, text: qinfo.text };
    let taglist = [];

    for (let i = 0; i < qinfo.tags.length; i++) {
        let name = qinfo.tags[i];
        const t = await Tag.findOne({ name: name });
        if (t) {
            taglist.push(t._id);
        } else {
            if (user.reputation < 50) {
                res.status(400);
                res.json({
                    errmsg: "New tags can only be added by users with reputation of 50 or more.",
                });
                return;
            }
            const newTag = await Tag.create({ name, created_by: uid });
            taglist.push(newTag._id);
        }
    }

    updated.tags = taglist;

    const uq = await Question.findOneAndUpdate({ _id: qid }, updated, {
        new: true,
    });

    res.status(200);
    res.json({ qid: uq._id });
};

const deleteQuestion = async (req, res) => {
    const qid = req.params.qid;
    const uid = req.session.user;
    const q = await Question.findById(qid);
    if (q.asked_by != uid) {
        res.status(400);
        res.json({ errmsg: "Userinfo error, it may not your question" });
        return;
    }

    await Promise.all(
        (q.answers || []).map(async (a) => {
            await Promise.all(
                (a.comments || []).map(async (c) => {
                    await Comment.deleteOne({ _id: c });
                })
            );
            await Answer.deleteOne({ _id: a });
        })
    );

    await Promise.all(
        (q.comments || []).map(async (c) => {
            await Comment.deleteOne({ _id: c });
        })
    );

    const dq = await Question.deleteOne({ _id: qid });

    if (dq) {
        res.sendStatus(200);
    } else {
        res.status(400);
        res.json({ errmsg: "Delete failed!" });
    }
};

router.get("/getQuestion", getQuestionsByFilter);
router.post("/addQuestion", checkUser, addQuestion);
router.get("/getQuestionById/:qid", getQuestionById);
router.post("/upvote", checkUser, upvote);
router.post("/downvote", checkUser, downvote);
router.post("/postComment", checkUser, postComment);
router.post("/acceptAns", checkUser, acceptAns);
router.get("/getUserQuestions", checkUser, getUserQuestions);
router.put("/editQuestion", checkUser, editQuestion);
router.delete("/deleteQuestion/:qid", checkUser, deleteQuestion);

module.exports = router;

const getNewestQuestion = (qlist) => {
    return qlist.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
            return -1;
        } else if (a.createdAt < b.createdAt) {
            return 1;
        } else {
            return 0;
        }
    });
};

const getActiveQuestion = (qlist) => {
    return qlist.sort((a, b) => {
        if (a.updatedAt > b.updatedAt) {
            return -1;
        } else if (a.updatedAt < b.updatedAt) {
            return 1;
        } else {
            return 0;
        }
    });
};

const getUnansweredQuestion = (qlist) => {
    return getNewestQuestion(qlist).filter((q) => q.answers.length == 0);
};

const checkTagInQuestion = (q, taglist) => {
    for (let tagname of taglist) {
        for (let tag of q.tags) {
            if (tagname == tag.name) {
                return true;
            }
        }
    }

    return false;
};

const checkKeywordInQuestion = (q, keywordlist) => {
    for (let w of keywordlist) {
        if (q.title.includes(w) || q.text.includes(w)) {
            return true;
        }
    }

    return false;
};

const parseTags = (search) => {
    return (search.match(/\[([^\]]+)\]/g) || []).map((word) =>
        word.slice(1, -1)
    );
};

const parseKeyword = (search) => {
    return search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];
};
