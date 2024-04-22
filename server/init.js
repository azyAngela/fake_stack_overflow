// Setup database with initial test data.
const mongoose = require("mongoose");
let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let Profile = require('./models/profiles')

const { MONGO_URL } = require("./config");

mongoose.connect(MONGO_URL);
function tagCreate(name) {
    let tag = new Tag({ name: name });
    return tag.save();
}
function answerCreate(text, ans_by, ans_date_time) {
    let answerdetail = {text:text};
    if (ans_by != false) answerdetail.ans_by = ans_by;
    if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  
    let answer = new Answer(answerdetail);
    return answer.save();
  }
  
function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views) {
    let qstndetail = {
    title: title,
    text: text,
    tags: tags.map(tag => tag.name),
    asked_by: asked_by
    }
    if (answers != false) qstndetail.answers = answers;
    if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
    if (views != false) qstndetail.views = views;

    let qstn = new Question(qstndetail);
    return qstn.save();
}

function profileCreate(username, email, password, answers, questions, reputation, created_date_time, isAdmin = false) {
    let profiledetail = {
        username: username,
        email: email,
        password: password,
        reputation: reputation,
        isAdmin: isAdmin
    }
    if (answers != false) profiledetail.answers = answers;
    if (created_date_time != false) profiledetail.created_date_time = created_date_time;
    if (questions != false) profiledetail.questions = questions;
    let profile = new Profile(profiledetail);
    return profile.save();
}

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const init = async () => {
    console.log('insert test data into the database')
    let t1 = await tagCreate('react');
    let t2 = await tagCreate('javascript');
    let t3 = await tagCreate('android-studio');
    let t4 = await tagCreate('shared-preferences');
    let t5 = await tagCreate('storage');
    let t6 = await tagCreate('website');
    let t7 = await tagCreate('Flutter');
    let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', 'hamkalo', new Date('2023-11-20T03:24:42'));
    let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', 'azad', new Date('2023-11-23T08:24:00'));
    let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', 'abaya', new Date('2023-11-18T09:24:00'));
    let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', 'alia', new Date('2023-11-12T03:30:00'));
    let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', 'sana', new Date('2023-11-01T15:24:19'));
    let a6 = await answerCreate('Storing content as BLOBs in databases.', 'abhi3241', new Date('2023-02-19T18:20:59'));
    let a7 = await answerCreate('Using GridFS to chunk and store content.', 'mackson3332', new Date('2023-02-22T17:19:00'));
    let a8 = await answerCreate('Store data in a SQLLite database.', 'ihba001', new Date('2023-03-22T21:17:53'));
    let q1 = await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], 'Joji John', new Date('2022-01-20T03:00:00'), 10);
    let q2 = await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], 'saltyPeter', new Date('2023-01-10T11:24:30'), 121);
    let q3 = await questionCreate('Object storage for a web application', 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.', [t5, t6, t7], [a6, a7], 'monkeyABC', new Date('2023-02-18T01:02:15'), 200);
    let q4 = await questionCreate('Quick question about storage on android', 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains', [t3, t4, t5], [a8], 'elephantCDE', new Date('2023-03-10T14:28:01'), 103);
    await profileCreate('lucy','lucy@gmail.com','123', [a1, a2, a3], [q1, q2, q3], 10, new Date('2023-03-10T14:28:01'));
    await profileCreate('lily','lily@gmail.com','123', [a4, a5], [q4], 20, new Date('2023-03-10T14:28:01'));
    await profileCreate('ADMIN', 'ADMIN@gmail.com','ADMIN', [],[],0, new Date('2023-03-10T14:28:01'),true);
    if (db) db.close();

    console.log("done");
};

init().catch((err) => {
    console.log("ERROR: " + err);
    if (db) db.close();
});

console.log("processing ...");
