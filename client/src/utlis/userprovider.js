import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Creating a context
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        // Fetch CSRF token when the provider is mounted
        const fetchCsrfToken = async () => {
            const response = await axios.get('http://localhost:8000/profile/csrf-token', { withCredentials: true });
            setCsrfToken(response.data.csrfToken);
        };
        fetchCsrfToken();
        const checkLoginStatus = async () => {
            try {
              const response = await axios.get('http://localhost:8000/profile/check-login', {
                headers: {
                  'X-CSRF-Token': csrfToken,
                },
                withCredentials: true,
              });
              const resLoggedIn = response.data.loggedIn;
              if(resLoggedIn)
                setUser(response.data.user);
            } catch (error) {
              console.error('Error checking login status:', error);
            }
        }
        checkLoginStatus();
    }, []);

    // Provide user and CSRF token in context
    return (
        <UserContext.Provider value={{ user, setUser, csrfToken, setCsrfToken }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => React.useContext(UserContext);
