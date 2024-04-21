import axios from "axios";

const clientUrl = 'http://localhost:8000/question';

export const fetchQuestion = async (id) => {
    try {
        const response = await axios.get(`${clientUrl}/getQuestionById/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch question:', error);
        throw error;
    }
}

export const updateQuestion = async (id,question, csrfToken) => {
    try {
        const response = await axios.put(
            `${clientUrl}/updateQuestion/${id}`,
            question,
            {
                headers: {
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            }
        );
        return response;
    } catch (error) {
        console.error('Failed to update question:', error);
        throw error;
    }
}


export const addQuestion = async (question, csrfToken) => {
    try {
        const response = await axios.post(
            `${clientUrl}/addQuestion`,
            question,
            {
                headers: {
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            }
        );
        return response;
    } catch (error) {
        console.error('Failed to create question:', error);
        throw error;
    }
}

export const getQuestionList = async () => {
    try {
        const response = await axios.get(`${clientUrl}/getQuestion`);
        return response;
    } catch (error) {
        console.error('Failed to fetch question:', error);
        throw error;
    }
}

export const upvoteQuestion = async (id, csrfToken) => {
    try {
        const response = await axios.post(
            `${clientUrl}/upvoteQuestion/${id}`,
            null,
            {
                headers: {
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            }
        );
        return response;
    } catch (error) {
        console.error('Failed to upvote question:', error);
        throw error;
    }
}

export const downvoteQuestion = async (id, csrfToken) => {
    try {
        const response = await axios.post(
            `${clientUrl}/downvoteQuestion/${id}`,
            null,
            {
                headers: {
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            }
        );
        return response;
    } catch (error) {
        console.error('Failed to downvote question:', error);
        throw error;
    }
}