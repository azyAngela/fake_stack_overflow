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