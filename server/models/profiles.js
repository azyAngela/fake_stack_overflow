// Answer Document Schema
const mongoose = require("mongoose");

const Profile = require("./schema/profile");

module.exports = mongoose.model("Profile", Profile);
