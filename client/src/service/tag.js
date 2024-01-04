import { REACT_APP_API_URL, api } from "./config";

const TAG_API_URL = `${REACT_APP_API_URL}/tag`;

const getTagsWithQuestionNumber = async () => {
    const res = await api.get(`${TAG_API_URL}/getTagsWithQuestionNumber`);

    return res;
};

const getUserTags = async (token) => {
    const res = await api.get(`${TAG_API_URL}/getUserTags`, {
        headers: { Authorization: token },
    });

    return res;
};

const editTag = async (tinfo, token) => {
    const res = await api.put(`${TAG_API_URL}/editTag`, tinfo, {
        headers: { Authorization: token },
    });

    return res;
};

const deleteTag = async (tid, token) => {
    const res = await api.delete(`${TAG_API_URL}/deleteTag/${tid}`, {
        headers: { Authorization: token },
    });

    return res;
};

export { getTagsWithQuestionNumber, getUserTags, editTag, deleteTag };
