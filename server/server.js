// Application server

const express = require("express");
const mongoose = require("mongoose");

const { MONGO_URL, port } = require("./config");

mongoose.connect(MONGO_URL);

const app = express();

app.get("/", (_, res) => {
    res.send("Fake SO Server Dummy Endpoint");
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
