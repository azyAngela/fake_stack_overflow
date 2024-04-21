import axios from 'axios';

const CHECK_LOGIN_ENDPOINT = 'http://localhost:8000/profile/check-login';

const checkLoginStatus = async () => {
  try {
    const response = await axios.get(CHECK_LOGIN_ENDPOINT, {
      withCredentials: true // Ensure cookies are sent with the request for session-based authentication
    });

    // Check if the user is logged in based on the response
    return response.data.loggedIn;
    // Assuming your backend returns a JSON object with a 'loggedIn' property
  } catch (error) {
    console.error('Failed to check login status:', error);
    return false; // Return false in case of any errors or if the user is not logged in
  }
};

export default checkLoginStatus;
