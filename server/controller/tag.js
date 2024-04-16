const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");
const router = express.Router();
router.use(express.json());


// add appropriate HTTP verbs and their endpoints to the router.
router.get("/getTagsWithQuestionNumber", async (req, res) => {
    try {
        // Fetch all tags
        const tags = await Tag.find();
        const questions = await Question.find().populate("tags");
        // Initialize an array to hold the tag names and question count
        let tagsWithCount = [];

        for (let tag of tags) {
            // For each tag, count the number of questions associated with it
            let counter = 0
            for (let question of questions) {
                // Assuming temptags is an array of tag objects and each tag object has an _id property
                const tempTagIds = question.tags.map(t => t.name.toString()); // Convert ObjectIds to strings for comparison
                if (tempTagIds.includes(tag.name)) {
                    counter += 1;
                }
            }
            tagsWithCount.push({ name: tag.name, qcnt: counter });
        }
        res.json(tagsWithCount);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
