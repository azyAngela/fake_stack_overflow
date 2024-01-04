const mongoose = require("mongoose");

// Schema for questions
module.exports = mongoose.Schema(
    {
        title: {
            type: String,
        },
        text: {
            type: String,
        },
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
        answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
        accepted_ans: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer",
        },
        asked_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        views: {
            type: Number,
            default: 0,
        },
        voted: {
            type: Number,
            default: 0,
        },
    },
    { collection: "Question", timestamps: true }
);
