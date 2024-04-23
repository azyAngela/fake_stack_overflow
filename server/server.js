// Application server
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const bodyParser = require('body-parser');
const csurf = require('csurf');

const { MONGO_URL, port, CLIENT_URL } = require("./config");

mongoose.connect(MONGO_URL);

const app = express();

app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
app.use(cors({
    credentials: true,
    origin: CLIENT_URL
}))
app.use(express.json());
app.use(csurf());

const questionController = require("./controller/question");
const tagController = require("./controller/tag");
const answerController = require("./controller/answer");
const profileController = require("./controller/profile");

app.use("/question", questionController);
app.use("/tag", tagController);
app.use("/answer", answerController);
app.use("/profile", profileController);

app.get("/", (_, res) => {
    res.send("Fake SO Server Dummy Endpoint!!!!");
    res.end();
});

let server = app.listen(port, () => {
    console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
    server.close();
    mongoose.disconnect();
    console.log("Server closed. Database instance disconnected");
    process.exit(0);
});
module.exports = server;