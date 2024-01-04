const mongoose = require("mongoose");

// Schema for answers
module.exports = mongoose.Schema(
    {
        text: {
            type: String,
        },
        ans_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
        voted: {
            type: Number,
            default: 0,
        },
    },
    { collection: "Answer", timestamps: true }
);
