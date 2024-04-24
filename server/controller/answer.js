const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const router = express.Router();
const Profile = require("../models/profiles");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
router.use(express.json());

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    message: "Too many requests from this IP, please try again later."
  });
function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}
router.post("/addAnswer", limiter, async (req, res) => {
    const { qid, ans, uid } = req.body;
    if (!isValidObjectId(qid) || !isValidObjectId(ans) , !isValidObjectId(uid)) {
        return res.status(400).json({ message: "Question ID and UID and answer are required." });
    }
    try {
        
        const newAnswer = new Answer({text: ans.text,
            ans_by: ans.ans_by == null ? null : ans.ans_by,
            ans_date_time: new Date()});
        let savedAnswer = null;

        savedAnswer = await Answer.create(newAnswer);

        // Send back the saved answer
        await Question.findOneAndUpdate(
            { _id: qid },
            { $push: { answers: { $each: [savedAnswer._id], $position: 0 } } },
            { new: true }
          );
        await Profile.findOneAndUpdate(
            { _id: uid },
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

router.put("/updateAnswer/:aid", limiter, async (req, res) => {
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
    
router.delete("/deleteAnswer/:aid", limiter, async (req, res) => {
    const answerId  = req.params.aid;
    try {
        const deletedAnswer = await Answer.findOneAndDelete({ _id: answerId });
        if (!deletedAnswer) {
            return res.status(404).json({ message: "Answer not found" });
        }

        // Remove the reference from all questions
        await Question.updateMany(
            { answers: answerId },
            { $pull: { answers: answerId } }
        );
        await Profile.updateMany(
            { answers: answerId },
            { $pull: { answers: answerId } }
        );

        res.status(200).json(deletedAnswer);
    } catch (error) {
        console.error("Failed to delete answer:", error);
        res.status(500).json({ message: error.message});
    }
});

router.put("/upvoteAnswer/:aid", limiter, async (req, res) => {
    const id = req.params.aid;
    try {
        const increment = req.body.increment || 0;
        const updatedAnswer = await Answer.findByIdAndUpdate(id, { $inc: { upvotes: increment } }, { new: true });

        res.status(200).json(updatedAnswer);
    } catch (error) {
        console.error("Failed to upvote answer:", error);
        res.status(500).json({ message: "Failed to upvote answer due to server error." });
    }
});

router.put("/downvoteAnswer/:aid", limiter, async (req, res) => {
    const id = req.params.aid;
    try {
        const increment = req.body.increment || 0;
        const updatedAnswer = await Answer.findByIdAndUpdate(id, { $inc: { upvotes: increment } }, { new: true });

        res.status(200).json(updatedAnswer);
    } catch (error) {
        console.error("Failed to downvote answer:", error);
        res.status(500).json({ message: "Failed to downvote answer due to server error." });
    }
});
// add appropriate HTTP verbs and their endpoints to the router.

router.use((err, req, res, next) => {
    if (err instanceof rateLimit.RateLimitExceeded) {
      res.status(429).json({ message: "Too many requests, please try again later." });
    } else {
      next(err);
    }
  });

module.exports = router;
