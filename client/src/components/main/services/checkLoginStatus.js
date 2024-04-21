import axios from 'axios';

const CHECK_LOGIN_ENDPOINT = 'http://localhost:8000/profile/check-login';

const checkLoginStatus = async () => {
  try {
    const response = await axios.get(CHECK_LOGIN_ENDPOINT, {
      withCredentials: true 
    });

    return response.data.loggedIn;
  } catch (error) {
    console.error('Failed to check login status:', error);
    return false; 
  }
};

export default checkLoginStatus;
