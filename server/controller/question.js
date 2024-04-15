const express = require("express");
const { addTag } = require('../utils/question');
const Question = require("../models/questions");
const router = express.Router();
router.use(express.json());


// add appropriate HTTP verbs and their endpoints to the router.

router.get("/getQuestion", async (req, res) => {
    try {
        const questions = await Question.find().populate("answers");
        res.status(200).json(questions);
    } catch (error) {
        console.error("Failed to get questions:", error);
        res.status(500).json({ message: "Failed to get questions due to server error." });
    }
})  

router.get("/getQuestionById/:qid", async (req, res) => {
    const id  = req.params.qid;
    try {
        const updated = await Question.findOneAndUpdate(
            { _id: id },
            { $inc: { views: 1 } },
            { new: true }
          ).populate("answers");
        res.status(200).json(updated);
    } catch (error) {
        console.error("Failed to get question:", error);
        res.status(500).json({ message: "Failed to get question due to server error." });
    }
});

router.put("/upvoteQuestion/:qid", async (req, res) => {
    const id  = req.params.qid;
    try {
        const updated = await Question.findOneAndUpdate({ _id: id }, { $inc: { upvotes: 1 } }, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        console.error("Failed to upvote question:", error);
        res.status(500).json({ message: "Failed to upvote question due to server error." });
    }
});

router.put("/downvoteQuestion/:qid", async (req, res) => {
    const id  = req.params.qid;
    try {
        const updated = await Question.findOneAndUpdate({ _id: id }, { $inc: { upvotes: -1 } }, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        console.error("Failed to upvote question:", error);
        res.status(500).json({ message: "Failed to upvote question due to server error." });
    }
});

router.post("/addQuestion", async (req, res) => {
    const body  = req.body;
    const todoTags = body.tags
    const tagIds = []
    try {
        for (let tag of todoTags) {
            const newTag = await addTag(tag);
            tagIds.push(newTag);
        }
        body.tags = tagIds;
        const newQuestion = await Question.create(body);
        //console.log(newQuestion);
        res.status(200).json(newQuestion);
    } catch (error) {
        console.error("Failed to add question:", error);
        res.status(500).json({ message: "Failed to add question due to server error." });
    }
});

router.delete("/deleteQuestion/:qid", async (req, res) => {
    const qid  = req.params.qid;
    try {
        await Question.findByIdAndRemove(qid);

        await Profile.updateMany(
            { questions: qid },
            { $pull: { questions: qid } }
        );

        res.status(200).json(deleted);
    } catch (error) {
        console.error("Failed to delete question:", error);
        res.status(500).json({ message: "Failed to delete question due to server error." });
    }
});

router.put("/updateQuestion/:qid", async (req, res) => {
    const id  = req.params.qid;
    const body = req.body;
    try {
        const updated = await Question.findOneAndUpdate( { _id: id }, body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        console.error("Failed to update question:", error);
        res.status(500).json({ message: "Failed to update question due to server error." });
    }
});




module.exports = router;
