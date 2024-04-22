import React, { useState , useCallback, useEffect} from 'react';
import { useUser } from '../../../utlis/userprovider';
import { useNavigate } from 'react-router-dom';
import { getCsrfToken, login } from '../services/profile.js';
// import { encryptPassword, comparePassword } from '../services/encryption.js';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState('');
  const { setUser} = useUser();
  const [error, setError] = useState('');

  const jumpMain = () => { navigate('/'); }

  const fetchCsrfToken = useCallback(async () =>
  {
   try {
     const response = await getCsrfToken();
     setCsrfToken(response);
   } catch (error) {
     setError('Error fetching CSRF token:', error);
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
    // console.log('username:', password);
    // const encryptedPasswordPromise = encryptPassword(password);
    // const encryptedPassword = await encryptedPasswordPromise;
    // console.log('Encrypted password:', encryptedPassword);
    try {
      // const isPasswordCorrect = await comparePassword(password, encryptedPassword);
      // if (!isPasswordCorrect) {
      //   setError('Incorrect password');
      //   return;
      // }
      const response = await login(username, password, csrfToken);
      setUser(response.user);
        setUsername('');
        setPassword('');

        setMessage('User loggedin successfully, redirecting to main page...');
        setTimeout(() => {
            jumpMain();
        }, 2000);
    } catch (error) {
      setError('Username or password is incorrect');
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
          <button className="btn btn-primary" onClick={handleLogin}>Log in</button>
        </div>
        
        {message && <div className="mt-3 text-primary">{message}</div>}
        {error && <div className="mt-3 text-danger">{error}</div>}

    </div>
  );
}

export default Login;
