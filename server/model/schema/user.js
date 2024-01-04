const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
        },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        },
        reputation: {
            type: Number,
            default: 0,
        },
    },
    { collection: "User", timestamps: true }
);
