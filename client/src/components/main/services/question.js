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