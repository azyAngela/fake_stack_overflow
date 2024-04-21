import axios from "axios";

const clientUrl = 'http://localhost:8000/answer';


export const addAnswer = async (answer, csrfToken) => {
    try {
        const response = await axios.post(
            `${clientUrl}/addAnswer`,
            answer,
            {
                headers: {
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to create answer:', error);
        throw error;
    }
}

export const updateAnswer = async (id, answer, csrfToken) => {
    try {
        const response = await axios.put(
            `${clientUrl}/updateAnswer/${id}`,
            answer,
            {
                headers: {
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            }
        );
        return response;
    } catch (error) {
        console.error('Failed to update answer:', error);
        throw error;
    }
}

export const upvoteAnswer = async (id, csrfToken) => {
    try {
        const response = await axios.post(
            `${clientUrl}/upvoteAnswer/${id}`,
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
        console.error('Failed to upvote answer:', error);
        throw error;
    }
}

export const downvoteAnswer = async (id, csrfToken) => {
    try {
        const response = await axios.post(
            `${clientUrl}/downvoteAnswer/${id}`,
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
        console.error('Failed to upvote answer:', error);
        throw error;
    }
}