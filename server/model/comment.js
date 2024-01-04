const mongoose = require("mongoose");

const Comment = require("./schema/comment");

module.exports = mongoose.model("Comment", Comment);
