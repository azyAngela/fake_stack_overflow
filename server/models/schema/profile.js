const mongoose = require("mongoose");

// Schema for answers
const ProfileSchema = new mongoose.Schema({
        username: {type : String, required: true},
        password: {type : String, required: true},
        email: {type : String, required: true},
        answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
        questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question'}],
        reputation: {type : Number, required: true, default: 0},
        created_date_time: {type : Date, required: true},
    },
    { collection: "Profile" }
);

module.exports = ProfileSchema;
mongoose.model('Profile', ProfileSchema);