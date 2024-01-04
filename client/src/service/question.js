import { REACT_APP_API_URL, api } from "./config";

const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

const getQuestionsByFilter = async (order = "newest", search = "") => {
    const res = await api.get(
        `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
    );

    return res;
};

const addQuestion = async (q, token) => {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q, {
        headers: { Authorization: token },
    });

    return res;
};

const getQuestionById = async (qid) => {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);
    return res;
};

const upvote = async (qid, token) => {
    const res = await api.post(
        `${QUESTION_API_URL}/upvote`,
        { qid },
        { headers: { Authorization: token } }
    );

    return res;
};

const downvote = async (qid, token) => {
    const res = await api.post(
        `${QUESTION_API_URL}/downvote`,
        { qid },
        { headers: { Authorization: token } }
    );

    return res;
};

const postComment = async (qid, text, token) => {
    const res = await api.post(
        `${QUESTION_API_URL}/postComment`,
        { qid, text },
        { headers: { Authorization: token } }
    );
    return res;
};

const acceptAns = async (qid, aid, token) => {
    const res = await api.post(
        `${QUESTION_API_URL}/acceptAns`,
        { qid, aid },
        { headers: { Authorization: token } }
    );
    return res;
};

const getUserQuestions = async (token) => {
    const res = await api.get(`${QUESTION_API_URL}/getUserQuestions`, {
        headers: { Authorization: token },
    });
    return res;
};

const editQuestion = async (qinfo, token) => {
    const res = await api.put(`${QUESTION_API_URL}/editQuestion`, qinfo, {
        headers: { Authorization: token },
    });
    return res;
};

const deleteQuestion = async (qid, token) => {
    const res = await api.delete(`${QUESTION_API_URL}/deleteQuestion/${qid}`, {
        headers: { Authorization: token },
    });

    return res;
};

export {
    getQuestionsByFilter,
    addQuestion,
    getQuestionById,
    upvote,
    downvote,
    postComment,
    acceptAns,
    getUserQuestions,
    editQuestion,
    deleteQuestion,
};
