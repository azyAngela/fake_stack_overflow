// Setup database with initial test data.
const mongoose = require("mongoose");
let Tag = require('./models/tags')

const { MONGO_URL } = require("./config");

mongoose.connect(MONGO_URL);
function tagCreate(name) {
    let tag = new Tag({ name: name });
    return tag.save();
}


let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const init = async () => {
    console.log('insert test data into the database')
    let t1 = await tagCreate('react');
    if (db) db.close();

    console.log("done");
};

init().catch((err) => {
    console.log("ERROR: " + err);
    if (db) db.close();
});

console.log("processing ...");
