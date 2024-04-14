const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const router = express.Router();
router.use(express.json());

router.post("/addAnswer", async (req, res) => {
    const { qid, ans } = req.body;
    if (!qid || !ans) {
        return res.status(400).json({ message: "Question ID and answer are required." });
    }
    try {
        
        const newAnswer = new Answer({text: ans.text,
            ans_by: ans.ans_by == null ? null : ans.ans_by,
            ans_date_time: new Date()});
        let savedAnswer = null;
        if(ans.ans_by == null){
            savedAnswer = await Answer.create({text: "This is a test answer"});
        }else{
            savedAnswer = await Answer.create(newAnswer);
        }

        // Send back the saved answer
        await Question.findOneAndUpdate(
            { _id: qid },
            { $push: { answers: { $each: [savedAnswer._id], $position: 0 } } },
            { new: true }
          );

        // Send back the saved answer
        res.status(200).json(savedAnswer);
    } catch (error) {
        console.error("Failed to add answer:", error);
        res.status(500).json({ message: error.message});
    }

});

router.put("/updateAnswer/:aid", async (req, res) => {
    const id  = req.params.aid;
    const body = req.body;
    try {
        const updated = await Answer.findOneAndUpdate( { _id: id }, body, { new: true });
            res.status(200).json(updated);
        } catch (error) {
            console.error("Failed to update answer:", error);
            res.status(500).json({ message: "Failed to update answer due to server error." });
        }
    });
    
router.delete("/deleteAnswer/:aid", async (req, res) => {
    const answerId  = req.params.aid;
    try {
        await Answer.findByIdAndRemove(answerId);

        // Remove the reference from all questions
        await Question.updateMany(
            { answers: answerId },
            { $pull: { answers: answerId } }
        );
        await Profile.updateMany(
            { answers: answerId },
            { $pull: { answers: answerId } }
        );

        res.status(200).json(deleted);
    } catch (error) {
        console.error("Failed to delete answer:", error);
        res.status(500).json({ message: error.message});
    }
});

router.post("/upvoteAnswer/:aid", async (req, res) => {
    const id  = req.params.aid;
    try {
        const updated = await Answer.findOneAndUpdate( { _id: id }, { $inc: { upvotes: 1 } }, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        console.error("Failed to upvote answer:", error);
        res.status(500).json({ message: "Failed to upvote answer due to server error." });
    }
});

router.post("/downvoteAnswer/:aid", async (req, res) => {
    const id  = req.params.aid;
    try {
        const updated = await Answer.findOneAndUpdate( { _id: id }, { $inc: { upvotes: -1 } }, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        console.error("Failed to upvote answer:", error);
        res.status(500).json({ message: "Failed to upvote answer due to server error." });
    }
});
// add appropriate HTTP verbs and their endpoints to the router.

module.exports = router;
