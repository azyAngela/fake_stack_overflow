const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        text: {
            type: String,
        },
        commented_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        voted: {
            type: Number,
            default: 0,
        },
    },
    { collection: "Comment", timestamps: true }
);
