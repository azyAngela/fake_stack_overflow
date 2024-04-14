// Answer Document Schema
const mongoose = require("mongoose");

const Answer = require("./schema/answer");

module.exports = mongoose.model("Answer", Answer);
