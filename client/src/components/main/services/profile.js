import axios from 'axios';

const clientUrl = 'http://localhost:8000/profile';

export const updateProfile = async (newUser, csrfToken) => {
    try {
        const response = await axios.post(`${clientUrl}/updateProfile`, newUser, {
            headers: {
                'X-CSRF-Token': csrfToken,
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error; 
    }
}

export const getCsrfToken = async () => {
    try {
        const response = await axios.get(`${clientUrl}/csrf-token`, { withCredentials: true });
        return response.data.csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
}

export const logout = async (csrfToken) => {
    try {
        const response = await axios.post(`${clientUrl}/logout`, null, {
            headers: {
                'X-CSRF-Token': csrfToken,
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
}

export const login = async (username, password, csrfToken) => {
    try {
        const response = await axios.post(`${clientUrl}/login`, {username, password}, {
            headers: {
                'X-CSRF-Token': csrfToken,
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export const signup = async (newUser, csrfToken) => {
    try {
        const response = await axios.post(`${clientUrl}/signup`, newUser, {
            headers: {
                'X-CSRF-Token': csrfToken,
            },
            withCredentials: true,
        });
        return response
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}

export const checkLoginStatus = async (csrfToken) => {
    try {
        const response = await axios.get(`${clientUrl}/check-login`, {
            headers: {
                'X-CSRF-Token': csrfToken,
            },
            withCredentials: true,
        });
        return response;
    } catch (error) {
        console.error('Error checking login status:', error);
        throw error;
    }
}