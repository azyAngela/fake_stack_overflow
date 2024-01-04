// Application server

const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");

const { MONGO_URL, CLIENT_URL, port, SECRET } = require("./config");

mongoose.connect(MONGO_URL);

const app = express();

app.use(
    cors({
        credentials: true,
        origin: [CLIENT_URL],
    })
);

app.use(
    session({
        secret: SECRET,
        cookie: {
            httpOnly: true,
            sameSite: true,
        },
        resave: false,
        saveUninitialized: false,
    })
);

app.use(express.json());

app.get("", (req, res) => {
    res.send("hello world");
    res.end();
});

const userController = require("./controller/user");
const questionController = require("./controller/question");
const tagController = require("./controller/tag");
const commentController = require("./controller/comment");
const answerController = require("./controller/answer");

app.use("/user", userController);
app.use("/question", questionController);
app.use("/tag", tagController);
app.use("/comment", commentController);
app.use("/answer", answerController);

let server = app.listen(port, () => {
    console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
    server.close();
    mongoose.disconnect();
    console.log("Server closed. Database instance disconnected");
    process.exit(0);
});
