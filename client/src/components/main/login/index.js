import React, { useState , useCallback, useEffect} from 'react';
import axios from 'axios';
import { useUser } from '../../../utlis/userprovider';
import { useNavigate } from 'react-router-dom';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { csrfToken, setUser, setCsrfToken} = useUser();
  const jumpMain = () => { navigate('/'); }

  const fetchCsrfToken = useCallback(async () =>
  {
   try {
     const response = await axios.get('http://localhost:8000/profile/csrf-token', { withCredentials: true });
     setCsrfToken(response.data.csrfToken);
   } catch (error) {
     console.error('Error fetching CSRF token:', error);
   }
  }, []);
  useEffect(() => {
    const fetchCsrf = async () => {
        await fetchCsrfToken();
      };
    fetchCsrf()
  }, [fetchCsrfToken]);

  const handleLogin = async () => {
    // Make sure to include the CSRF token in the headers
    try {
      const response = await axios.post('http://localhost:8000/profile/login', { username, password }, {
        headers: {
            'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
    });
      setUser(response.data.user);
        setUsername('');
        setPassword('');

        setMessage('User loggedin successfully, redirecting to main page...');
        setTimeout(() => {
            jumpMain();
        }, 2000);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  


  return (
    <div className="container mt-5">
       
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
        
        {message && <div className="mt-3 text-primary">{message}</div>}
    </div>
  );
}

export default Login;
