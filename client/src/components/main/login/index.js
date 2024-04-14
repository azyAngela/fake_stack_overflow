import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [csrfToken, setCsrfToken] = useState('');

  const fetchCsrfToken = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8001/csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  }, []);

  const checkLoginStatus = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8001/check-login', {
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });
      const resLoggedIn = response.data.loggedIn;
      setLoggedIn(resLoggedIn);
      if (resLoggedIn)
        setUser(response.data.user.username);
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  }, [csrfToken]);

  useEffect(() => {
    const fetchCsrfAndCheckLoginStatus = async () => {
      await fetchCsrfToken();
      await checkLoginStatus();
    };

    // Call the function only when the component mounts
    if (!csrfToken) {
      fetchCsrfAndCheckLoginStatus();
    }
  }, [csrfToken, fetchCsrfToken, checkLoginStatus]);


  const handleLogin = async () => {
    // Make sure to include the CSRF token in the headers
    try {
      const response = await axios.post('http://localhost:8001/login', { username, password }, {
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      setLoggedIn(response.data.success);
      setUser(response.data.user.username);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8001/logout', null, {
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      setLoggedIn(false);
      setUser("");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="container mt-5">
      {loggedIn ? (
        <div>
          <p className="mb-3">Welcome, {user}!</p>
          <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username: </label>
            <input style={{ maxWidth: '300px' }} type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password: </label>
            <input style={{ maxWidth: '300px' }} type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}

export default Login;
