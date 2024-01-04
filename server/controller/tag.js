const express = require("express");
const Tag = require("../model/tag");
const Question = require("../model/question");
const Answer = require("../model/answer");
const Comment = require("../model/comment");
const { checkUser } = require("../auth");

const router = express.Router();

const getTagsWithQuestionNumber = async (req, res) => {
    let tlist = await Tag.find();
    const tmap = new Map(tlist.map((t) => [t.name, 0]));
    let qlist = await Question.find().populate({ path: "tags", model: Tag });
    qlist.map((q) => {
        q.tags.map((t) => {
            tmap.set(t.name, tmap.get(t.name) + 1);
        });
    });

    res.json(
        Array.from(tmap, (item) => {
            return { name: item[0], qcnt: item[1] };
        })
    );
};

const getUserTags = async (req, res) => {
    const uid = req.session.user;
    const tlist = await Tag.find({ created_by: uid });
    const tmap = new Map(tlist.map((t) => [t.name, 0]));
    const tids = new Map(tlist.map((t) => [t.name, t._id]));
    let qlist = await Question.find().populate({ path: "tags", model: Tag });
    qlist.map((q) => {
        q.tags.map((t) => {
            if (tmap.has(t.name)) {
                tmap.set(t.name, tmap.get(t.name) + 1);
            }
        });
    });
    res.json(
        Array.from(tmap, (item) => {
            return { _id: tids.get(item[0]), name: item[0], qcnt: item[1] };
        })
    );
};

const editTag = async (req, res) => {
    const tinfo = req.body;
    const uid = req.session.user;
    const tid = tinfo._id;
    const t = await Tag.findById(tid);
    if (t.created_by != uid) {
        res.status(400);
        res.json({ errmsg: "Userinfo error, it may not your question" });
        return;
    }

    const ulist = new Set();
    const al = await Question.find({ tags: tid });
    al.map((a) => {
        ulist.add(a.asked_by.toString());
    });

    if (ulist.size > 1) {
        res.status(400);
        res.json({ errmsg: "This tag is used by other users" });
        return;
    }

    const ut = await Tag.findOneAndUpdate(
        { _id: tid },
        { name: tinfo.name },
        { new: true }
    );

    res.json({ tid: ut._id });
};

const deleteTag = async (req, res) => {
    const tid = req.params.tid;
    const uid = req.session.user;
    const t = await Tag.findById(tid);
    if (t.created_by != uid) {
        res.status(400);
        res.json({ errmsg: "Userinfo error, it may not your question" });
        return;
    }

    const ulist = new Set();
    const al = await Question.find({ tags: tid });
    al.map((a) => {
        ulist.add(a.asked_by.toString());
    });

    if (ulist.size > 1) {
        res.status(400);
        res.json({ errmsg: "This tag is used by other users" });
        return;
    }

    for (let i = 0; i < al.length; i++) {
        const q = al[i];
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

        await Question.deleteOne({ _id: q._id });
    }

    const dt = await Tag.deleteOne({ _id: tid });

    if (dt) {
        res.sendStatus(200);
    } else {
        res.status(400);
        res.json({ errmsg: "Delete failed!" });
    }
};

router.get("/getTagsWithQuestionNumber", getTagsWithQuestionNumber);
router.get("/getUserTags", checkUser, getUserTags);
router.put("/editTag", checkUser, editTag);
router.delete("/deleteTag/:tid", checkUser, deleteTag);

module.exports = router;
