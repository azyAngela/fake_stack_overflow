const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
    {
        // add relevant properties.
        name: {type : String, required: true},
    },
    { collection: "Tag" }
)
module.exports = tagSchema;
mongoose.model('Tag', tagSchema);