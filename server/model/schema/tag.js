const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { collection: "Tag" }
);
