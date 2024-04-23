const express = require("express");
const { addTag } = require('../utils/question');
const Question = require("../models/questions");
const router = express.Router();
const Profile = require("../models/profiles");
router.use(express.json());
const fs = require('fs');
// const app = express();

const logStream = fs.createWriteStream('server.log', { flags: 'a' });
// Middleware for logging requests
router.use((req, res, next) => {
    const user = req.user ? req.user.username : 'Unknown User';
    const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.url} - User: ${user}`;
    logStream.write(logEntry + '\n');
    next();
});

// add appropriate HTTP verbs and their endpoints to the router.

router.get("/getQuestion", async (req, res) => {
    try {
        const questions = await Question.find().populate("answers").populate("tags");
        // const user = req.user ? req.user.username : 'Unknown User';
        const logEntry = `[${new Date().toISOString()}] Questions retrieved by ${req.ip}`;
        logStream.write(logEntry + '\n');
        res.status(200).json(questions);
    } catch (error) {
        console.error("Failed to get questions:", error);
        res.status(500).json({ message: "Failed to get questions due to server error." });
    }
})

router.get("/getQuestionById/:qid", async (req, res) => {
    const id = req.params.qid;
    try {
        const updated = await Question.findOneAndUpdate(
            { _id: id },
            { $inc: { views: 1 } },
            { new: true }
        ).populate("answers");
        const logEntry = `[${new Date().toISOString()}] Questions viewed by ${req.ip}`;
        logStream.write(logEntry + '\n');
        res.status(200).json(updated);
    } catch (error) {
        console.error("Failed to get question:", error);
        res.status(500).json({ message: "Failed to get question due to server error." });
    }
});

router.put("/upvoteQuestion/:qid", async (req, res) => {
    const id = req.params.qid;
    try {
        const increment = req.body.increment || 0;
        const updatedQuestion = await Question.findByIdAndUpdate(id, { $inc: { upvotes: increment } }, { new: true });
        const logEntry = `[${new Date().toISOString()}] Questions upvoted by ${req.ip}`;
        logStream.write(logEntry + '\n');
        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error("Failed to upvote question:", error);
        res.status(500).json({ message: "Failed to upvote question due to server error." });
    }
});

router.put("/downvoteQuestion/:qid", async (req, res) => {
    const id = req.params.qid;
    try {
        const increment = req.body.increment || 0;
        const updatedQuestion = await Question.findByIdAndUpdate(id, { $inc: { upvotes: increment } }, { new: true });

        const logEntry = `[${new Date().toISOString()}] Questions downvoted by ${req.ip}`;
        logStream.write(logEntry + '\n');
        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error("Failed to downvote question:", error);
        res.status(500).json({ message: "Failed to downvote question due to server error." });
    }
});


router.post("/addQuestion", async (req, res) => {
    const body = req.body;
    const todoTags = body.tags
    const username = body.asked_by;
    const tagIds = []
    try {
        for (let tag of todoTags) {
            const newTag = await addTag(tag);
            tagIds.push(tag);
        }
        body.tags = tagIds;
        const newQuestion = await Question.create(body);
        await Profile.findOneAndUpdate(
            { username: username },
            { $push: { questions: { $each: [newQuestion._id], $position: 0 } } },
            { new: true }
        );
        const logEntry = `[${new Date().toISOString()}] Questions added by ${req.ip}`;
        logStream.write(logEntry + '\n');
        res.status(200).json(newQuestion);
    } catch (error) {
        console.error("Failed to add question:", error);
        res.status(500).json({ message: "Failed to add question due to server error." });
    }
});

router.delete("/deleteQuestion/:qid", async (req, res) => {
    const qid = req.params.qid;
    try {
        const deletedQuestion = await Question.findOneAndDelete({ _id: qid });
        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        await Profile.updateMany(
            { questions: qid },
            { $pull: { questions: qid } }
        );

        const logEntry = `[${new Date().toISOString()}] Questions deleted by ${req.ip}`;
        logStream.write(logEntry + '\n');
        res.status(200).json(deletedQuestion);
    } catch (error) {
        console.error("Failed to delete question:", error);
        res.status(500).json({ message: "Failed to delete question due to server error." });
    }
});

router.put("/updateQuestion/:qid", async (req, res) => {
    const id = req.params.qid;
    const body = req.body;
    try {
        const updated = await Question.findOneAndUpdate({ _id: id }, body, { new: true });
        const logEntry = `[${new Date().toISOString()}] Questions updated by ${req.ip}`;
        logStream.write(logEntry + '\n');
        res.status(200).json(updated);
    } catch (error) {
        console.error("Failed to update question:", error);
        res.status(500).json({ message: "Failed to update question due to server error." });
    }
});




module.exports = router;
