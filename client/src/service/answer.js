import { REACT_APP_API_URL, api } from "./config";

const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

const upvote = async (qid, aid, token) => {
    const res = await api.post(
        `${ANSWER_API_URL}/upvote`,
        { qid, aid },
        { headers: { Authorization: token } }
    );

    return res;
};

const downvote = async (qid, aid, token) => {
    const res = await api.post(
        `${ANSWER_API_URL}/downvote`,
        { qid, aid },
        { headers: { Authorization: token } }
    );

    return res;
};

const postComment = async (qid, aid, text, token) => {
    const res = await api.post(
        `${ANSWER_API_URL}/postComment`,
        { qid, aid, text },
        { headers: { Authorization: token } }
    );
    return res;
};

const addAnswer = async (ans, qid, token) => {
    const res = await api.post(
        `${ANSWER_API_URL}/addAnswer`,
        { ans, qid },
        { headers: { Authorization: token } }
    );
    return res;
};

const getUserAnswers = async (token) => {
    const res = await api.get(`${ANSWER_API_URL}/getUserAnswers`, {
        headers: { Authorization: token },
    });
    return res;
};

const editAnswer = async (ainfo, token) => {
    const res = await api.put(`${ANSWER_API_URL}/editAnswer`, ainfo, {
        headers: { Authorization: token },
    });
    return res;
};

const deleteAnswer = async (aid, token) => {
    const res = await api.delete(`${ANSWER_API_URL}/deleteAnswer/${aid}`, {
        headers: { Authorization: token },
    });

    return res;
};

export {
    upvote,
    downvote,
    postComment,
    addAnswer,
    getUserAnswers,
    editAnswer,
    deleteAnswer,
};
