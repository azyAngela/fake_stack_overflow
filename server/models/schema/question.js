const mongoose = require("mongoose");

// Schema for questions
const questionSchema = new mongoose.Schema(
    {
        title: {type : String, required: true},
        text: {type : String, required: true},
        asked_by: {type : String, required: true},
        ask_date_time: {type : Date, required: true},
        views: {type : Number, required: true, default: 0},
        answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
        tags:[{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
        upvotes: {type : Number, required: true, default: 0},
    },
    { collection: "Question" }
);
questionSchema.pre('remove', async function(next) {
    const question = this;
    try {
        // Delete all answers that are associated with this question
        await Answer.deleteMany({ _id: { $in: question.answers } });
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = questionSchema;
mongoose.model('Question', questionSchema);