// Question Document Schema
const mongoose = require("mongoose");

const Question = require("./schema/question");

module.exports = mongoose.model("Question", Question);
