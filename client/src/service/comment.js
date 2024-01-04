import { REACT_APP_API_URL, api } from "./config";

const COMMENT_API_URL = `${REACT_APP_API_URL}/comment`;

const upvote = async (qid, cid, token) => {
    const res = await api.post(
        `${COMMENT_API_URL}/upvote`,
        { qid, cid },
        { headers: { Authorization: token } }
    );

    return res;
};

export { upvote };
