import React, { useState, useCallback, useEffect} from 'react';
import { useUser } from '../../../utlis/userprovider';
import { useNavigate } from 'react-router-dom';
import { getCsrfToken, signup } from '../services/profile.js';
import { validateSignup } from '../../../utlis/helper.js';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { csrfToken, setUser, setCsrfToken } = useUser();
  const navigate = useNavigate();

  const fetchCsrfToken = useCallback(async () =>
  {
   try {
     const response = await getCsrfToken();
     setCsrfToken(response);
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

  const jumpMain = () => { navigate('/'); }

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validateResult = validateSignup(email, password, confirmPassword,fullName);
    if (validateResult){
      setError(validateResult);
      return;
    }
      try {
        let newuser= {username: fullName, email: email, password: password}

        const response = await signup(newuser, csrfToken);
        setConfirmPassword('');
        setPassword('');
        setFullName('');
        setEmail('');
        setMessage('User created successfully, redirecting to main page...');
        setUser(response.data.user);
        setTimeout(() => {
            jumpMain();
        }, 2000);
      } catch (error) {
        setError('Error logging out:', error);
      }
  };

  return (
    <div className="container mt-5">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">User Name:</label>
          <input
            type="text"
            className="form-control"
            id="fullName"
            value={fullName}
            onChange={handleFullNameChange}
            style={{ maxWidth: '300px' }}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={handleEmailChange}
            style={{ maxWidth: '300px' }}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            style={{ maxWidth: '300px' }}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            style={{ maxWidth: '300px' }}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
      {error && <div className="mt-3 text-danger">{error}</div>}
      {message && <div className="mt-3 text-primary">{message}</div>}
    </div>
  );
};

export default SignUp;
