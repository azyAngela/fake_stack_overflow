import React, { useState, useCallback, useEffect } from 'react';
import { getMetaData } from '../../../utlis/dateFormat';
import { useNavigate } from 'react-router';
import { useUser } from '../../../utlis/userprovider';
import { Link } from 'react-router-dom';
import { getCsrfToken, updateProfile, logout } from '../services/profile.js';
const ProfilePage = () => {

    const [isEditing, setIsEditing] = useState(false);
    const [editUserName, setEditUserName] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const {setUser, user} = useUser();
    const navigate = useNavigate();
    const fetchCsrfToken = useCallback(async () => {
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
      fetchCsrf();
      }, [fetchCsrfToken]);
    // Function to handle save changes
    const handleSaveChanges = async () => {
        // Save changes to backend or update state as needed
        if (editPassword === '' || editUserName === '') {
            setError('Please fill in all fields');
            return;
        }

        // Make a PUT request to the backend endpoint
        try {
            let newuser= {username: editUserName, email: user.email, password: editPassword}
    
            const response = await updateProfile(newuser, csrfToken);
            setUser(response.user);
            setEditPassword('');
            setEditUserName('');
            setMessage('User updated successfully');
            setIsEditing(false);
          } catch (error) {
            setError('Error updating user:', error);
          }
       
    };

    const handleLogout = async () => {
        try {
            await logout(csrfToken);
            setUser("");
            navigate('/');
        } catch (error) {
          console.error('Error logging out:', error);
        }
      };
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Profile</h2>
            <div className="card mb-3">
                <div className="card-body">
                    <h3 className="card-title">User Information</h3>
                    {isEditing ? (
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control mb-2"
                                value={editUserName}
                                onChange={(e) => setEditUserName( e.target.value)}
                                placeholder='Username'
                            />
                            <input
                                className="form-control"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </div>
                    ) : (
                        <div>
                            <div className="mb-3">
                                <strong>Username:</strong> {user.username}
                            </div>
                            <div className="mb-3">
                                <strong>Email:</strong> {user.email}
                            </div>
                            <div className="mb-3">
                                <strong>Reputation:</strong> {user.reputation}
                            </div>
                        </div>
                    )}
                    {!isEditing && (
                        <button
                            className="btn btn-primary me-2"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                    )}
                    {isEditing && (
                        <button
                            className="btn btn-success me-2"
                            onClick={handleSaveChanges}
                        >
                            Save Changes
                        </button>
                    )}
                    {isEditing && (
                        <button
                            className="btn btn-danger"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    )}
                     {error && <div className="mt-3 text-danger">{error}</div>}
                    {message && <div className="mt-3 text-primary">{message}</div>}
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <h3 className="card-title">Question Activity History</h3>
                    {user.questions.map(post => (
                        <div key={post._id} className="card mb-3">
                        <div className="card-body">
                            <div className="row">
                            <div className="col-md-3 d-flex flex-column align-items-center">
                                <div className="vote-count mb-2">Upvotes: {post.upvotes}</div>
                            </div>
                            <div className="col-md-6">
                                <Link to={`/posts/${post._id}`} className="text-decoration-none text-dark">
                                <h3 className="card-title">{post.title}</h3>
                                </Link>
                                <p className="card-text">{post.text}</p>
                                <div className="tags mt-3">
                                {post.tags.map(tag => (
                                    <span key={tag} className="badge bg-primary me-1">{tag}</span>
                                ))}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div>
                                <div>{`asked ${getMetaData(new Date(post.ask_date_time))}`}</div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <h3 className="card-title">Answer Activity History</h3>
                    {user.answers.map(answer => (
                        <div key={answer._id} className="card mb-3">
                        <div className="card-body">
                            <p className="card-text">{answer.text}</p>
                            <div className="mt-4">
                            <div>{`answered by ${answer.ans_by}`}</div>
                            <div>{`answered ${getMetaData(new Date(answer.ans_date_time))}`}</div>
                            </div>
                            <div className="mt-3">
                                <span>Upvotes: {answer.upvotes}</span>
                            </div>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='mb-3'>
                <button className='btn btn-danger' onClick ={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default ProfilePage;
