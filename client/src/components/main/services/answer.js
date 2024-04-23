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

export const upvoteAnswer = async (id,increment, csrfToken) => {
    try {
        const response = await axios.put(
            `${clientUrl}/upvoteAnswer/${id}`,
            {increment},
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

export const downvoteAnswer = async (id,increment, csrfToken) => {
    try {
        const response = await axios.put(
            `${clientUrl}/downvoteAnswer/${id}`,
            {increment},
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

export const deleteAnswer = async (id, csrfToken) => {
    try {
        const response = await axios.delete(
            `${clientUrl}/deleteAnswer/${id}`,
            {
                headers: {
                    'X-CSRF-Token': csrfToken
                },
                withCredentials: true
            }
        );
        return response;
    } catch (error) {
        console.error('Failed to delete answer:', error);
        throw error;
    }
}