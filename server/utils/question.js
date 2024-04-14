const Tag = require("../models/tags");
const Question = require("../models/questions");

const addTag = async (tname) => {
    const tagExists = await Tag.findOne({ name: tname });
    if (tagExists) {
        return tagExists.id;
    }else{
        const newTag = new Tag({ name: tname });
        const savedTag = await newTag.save();
        return savedTag._id;
    }
};

const getQuestionsByOrder = async (order) => {
    const questions = await Question.find().populate('answers').populate('tags');
    // complete the function
    if(order === 'active'){
        // return the list of questions sorted by most recently answered
        return questions.sort((a, b) => {
            const aMostRecent = getMostRecentAnswerDate(a.answers);
            const bMostRecent = getMostRecentAnswerDate(b.answers);
        
            if (aMostRecent.getTime() === bMostRecent.getTime()) {
              // If both questions have the same most recent answer date, compare their ask_date_time
              return b.ask_date_time - a.ask_date_time;
            }
            return bMostRecent - aMostRecent;
          });
    }else if(order === 'newest'){
        // return the list of questions sorted by most recently asked
        return questions.sort((a, b) => b.ask_date_time - a.ask_date_time);
    }else{
        // return the list of questions sorted by unanswered questions
        return questions.filter((q) => q.answers.length === 0).sort((a, b) => b.ask_date_time - a.ask_date_time);
    }
}
const getMostRecentAnswerDate = (answers) => {
    if (answers.length === 0) return new Date(0); // Epoch time if no answers
    return answers.reduce((latest, answer) => {
      const answerDate = new Date(answer.ans_date_time); // Assuming `date` is the property to check
      return answerDate > latest ? answerDate : latest;
    }, new Date(0));
};

const checkKeywordInQuestion = (q, keywordlist) => {
    
    for (let w of keywordlist) {
        if (q.title.includes(w) || q.text.includes(w)) {
            return true;
        }
    }
    return false;
};

const checkTagInQuestion = (q, taglist) => {
    for (let tag of taglist) {
        for (let t of q.tags) {
            if (tag == t.name) {
                return true;
            }
        }
    }
};

const parseTags = (search) => {
    return (search.match(/\[([^\]]+)\]/g) || []).map((word) =>
        word.slice(1, -1)
    );
};

const parseKeyword = (search) => {
    return search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];
};

const filterQuestionsBySearch = (qlist, search) => {
    let searchTags = parseTags(search);
    let searchKeyword = parseKeyword(search);
    const res = qlist.filter((q) => {
        if (searchKeyword.length == 0 && searchTags.length == 0) {
            return true;
        } else if (searchKeyword.length == 0) {
            return checkTagInQuestion(q, searchTags); 
        } else if (searchTags.length == 0) {
            return checkKeywordInQuestion(q, searchKeyword);
        } else {
            return (
                checkKeywordInQuestion(q, searchKeyword) ||
                checkTagInQuestion(q, searchTags)
            );
        }
    });

    return res;
}


module.exports = { addTag, getQuestionsByOrder, filterQuestionsBySearch };