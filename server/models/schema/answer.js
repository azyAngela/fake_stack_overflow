const mongoose = require("mongoose");

// Schema for answers
const answerSchema = new mongoose.Schema({
        text: {type : String, required: true},
        ans_by: {type : String, required: true},
        ans_date_time: {type : Date, required: true},
        upvotes: {type : Number, required: true, default: 0},
    },
    { collection: "Answer" }
);

module.exports = answerSchema;
mongoose.model('Answer', answerSchema);