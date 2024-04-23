import React, { createContext, useState, useEffect } from 'react';
import { getCsrfToken, checkLoginStatus } from '../components/main/services/profile';

// Creating a context
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        // Fetch CSRF token when the provider is mounted
        const fetchCsrfToken = async () => {
            const response = await getCsrfToken();
            setCsrfToken(response);
            if (response) {
                const loginresponse = await checkLoginStatus(csrfToken);
                const resLoggedIn = loginresponse.data.loggedIn;
                if(resLoggedIn){
                  setUser(loginresponse.data.user);
                }
            }
        };
        fetchCsrfToken();
        
    }, []);

    // Provide user and CSRF token in context
    return (
        <UserContext.Provider value={{ user, setUser, csrfToken, setCsrfToken }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => React.useContext(UserContext);
