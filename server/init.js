// Setup database with initial test data.
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { MONGO_URL, saltRounds } = require("./config");

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const User = require("./model/user");
const Answer = require("./model/answer");
const Question = require("./model/question");
const Comment = require("./model/comment");
const Tag = require("./model/tag");

const createUser = async (username, email, password, reputation, createdAt) => {
    let hpwd = bcrypt.hashSync(password, saltRounds);
    let userinfo = { username, email, password: hpwd, createdAt };
    if (reputation) {
        userinfo.reputation = reputation;
    }
    let user = new User(userinfo);
    return user.save();
};

const createQuestion = async (
    title,
    text,
    tags,
    answers,
    comments,
    accepted_ans,
    asked_by,
    views,
    voted,
    createdAt
) => {
    let questionInfo = { title, text, tags, asked_by, createdAt };
    if (answers) {
        questionInfo.answers = answers;
    }
    if (comments) {
        questionInfo.comments = comments;
    }
    if (accepted_ans) {
        questionInfo.accepted_ans = accepted_ans;
    }
    if (views) {
        questionInfo.views = views;
    }
    if (voted) {
        questionInfo.voted = voted;
    }

    let q = new Question(questionInfo);
    return q.save();
};

const createAnswer = async (text, ans_by, comments, voted, createdAt) => {
    let ainfo = { text, ans_by, createdAt };
    if (comments) {
        ainfo.comments = comments;
    }
    if (voted) {
        ainfo.voted = voted;
    }

    let a = new Answer(ainfo);

    return a.save();
};

const createComment = async (text, commented_by, voted, createdAt) => {
    let cinfo = { text, commented_by, createdAt };
    if (voted) {
        cinfo.voted = voted;
    }

    let c = new Comment(cinfo);

    return c.save();
};

const createTag = async (name, created_by) => {
    let t = new Tag({ name, created_by });
    return t.save();
};

const init = async () => {
    let u1 = await createUser(
        "Joji John",
        "JJ@neu.com",
        "123456",
        100,
        new Date("2021-05-17T13:24:00").toISOString()
    );
    let u2 = await createUser(
        "saltyPeter",
        "sp@neu.com",
        "654321",
        78,
        new Date("2021-05-05T13:24:00").toISOString()
    );
    let u3 = await createUser(
        "sana",
        "sana@neu.com",
        "qwer",
        0,
        new Date("2023-05-05T13:24:00").toISOString()
    );
    let u4 = await createUser(
        "alia",
        "alia@bu.com",
        "asdf",
        0,
        new Date("2022-06-05T13:24:00").toISOString()
    );
    let u5 = await createUser(
        "abaya",
        "abaya@neu.com",
        "zxcd",
        55,
        new Date("2020-05-05T13:24:00").toISOString()
    );
    let u6 = await createUser(
        "azad",
        "azad@bu.com",
        "1234",
        66,
        new Date("2020-05-11T13:24:00").toISOString()
    );
    let u7 = await createUser(
        "hamkalo",
        "hamkalo@neu.com",
        "7890",
        77,
        new Date("2021-08-05T13:24:00").toISOString()
    );
    let t1 = await createTag("react", u1);
    let t2 = await createTag("javascript", u1);
    let t3 = await createTag("android-studio", u2);
    let t4 = await createTag("shared-preferences", u2);

    let c1 = await createComment(
        "comment 1",
        u1,
        13,
        new Date("2022-11-18T08:24:00").toISOString()
    );
    let c2 = await createComment(
        "comment 2",
        u2,
        12,
        new Date("2023-09-01T09:24:00").toISOString()
    );
    let c3 = await createComment(
        "comment 3",
        u5,
        11,
        new Date("2023-05-18T10:24:00").toISOString()
    );
    let c4 = await createComment(
        "comment 4",
        u6,
        10,
        new Date("2023-10-11T11:24:00").toISOString()
    );
    let c5 = await createComment(
        "comment 5",
        u7,
        9,
        new Date("2023-07-11T12:24:00").toISOString()
    );
    let c6 = await createComment(
        "comment 6",
        u1,
        8,
        new Date("2023-11-18T13:24:00").toISOString()
    );

    let c7 = await createComment(
        "comment 7",
        u2,
        7,
        new Date("2021-11-18T13:24:00").toISOString()
    );
    let c8 = await createComment(
        "comment 8",
        u5,
        0,
        new Date("2022-08-18T13:24:00").toISOString()
    );
    let c9 = await createComment(
        "comment 9",
        u6,
        5,
        new Date("2021-12-18T13:24:00").toISOString()
    );
    let c10 = await createComment(
        "comment 10",
        u7,
        4,
        new Date("2023-04-11T13:24:00").toISOString()
    );
    let c11 = await createComment(
        "comment 11",
        u1,
        3,
        new Date("2023-05-17T13:24:00").toISOString()
    );
    let c12 = await createComment(
        "comment 12",
        u2,
        2,
        new Date("2023-10-12T03:30:00").toISOString()
    );
    let c13 = await createComment(
        "comment 13",
        u5,
        1,
        new Date("2022-01-20T03:24:00").toISOString()
    );

    let a1 = await createAnswer(
        "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
        u7,
        [c1, c2, c3, c4],
        55,
        new Date("2023-11-20T03:24:42").toISOString()
    );
    let a2 = await createAnswer(
        "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
        u6,
        null,
        0,
        new Date("2023-11-25T08:24:00").toISOString()
    );
    let a3 = await createAnswer(
        "Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.",
        u5,
        null,
        0,
        new Date("2023-11-18T09:24:00").toISOString()
    );
    let a4 = await createAnswer(
        "YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);",
        u4,
        null,
        9,
        new Date("2023-11-12T03:30:00").toISOString()
    );
    let a5 = await createAnswer(
        "I just found all the above examples just too confusing, so I wrote my own. ",
        u3,
        [c5],
        11,
        new Date("2023-11-01T15:24:19").toISOString()
    );
    await createQuestion(
        "Programmatically navigate using React router",
        "the alert shows the proper index for the li clicked, and when I alert the variable within the last function I'm calling, moveToNextImage(stepClicked), the same value shows but the animation isn't happening. This works many other ways, but I'm trying to pass the index value of the list item clicked to use for the math to calculate.",
        [t1, t2],
        [a1, a2],
        [c6, c7, c8, c9],
        a2,
        u1,
        939,
        777,
        new Date("2022-01-20T03:24:00").toISOString()
    );
    await createQuestion(
        "android studio save string shared preference, start activity and load the saved string",
        "I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.",
        [t3, t4, t2],
        [a3, a4, a5],
        [c10, c11, c12, c13],
        null,
        u2,
        121,
        55,
        new Date("2023-10-01T11:24:30").toISOString()
    );
    if (db) db.close();

    console.log("done");
};

init().catch((err) => {
    console.log("ERROR: " + err);
    if (db) db.close();
});

console.log("processing ...");
