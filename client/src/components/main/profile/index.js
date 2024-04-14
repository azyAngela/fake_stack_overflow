import React, { useState } from 'react';

const ProfilePage = () => {
    // Dummy data for badges and activity
    const dummyBadges = ['Gold', 'Silver', 'Bronze'];
    const dummyActivity = ['Posted a question', 'Answered a question', 'Commented on a post'];

    // State for editable fields
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState('JohnDoe');
    const [aboutMe, setAboutMe] = useState('');

    // Function to handle save changes
    const handleSaveChanges = () => {
        // Save changes to backend or update state as needed
        setIsEditing(false);
    };

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
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <textarea
                                className="form-control"
                                value={aboutMe}
                                onChange={(e) => setAboutMe(e.target.value)}
                                rows="3"
                                placeholder="About me"
                            />
                        </div>
                    ) : (
                        <div>
                            <div className="mb-3">
                                <strong>Username:</strong> {username}
                            </div>
                            <div className="mb-3">
                                <strong>Email:</strong> johndoe@example.com
                            </div>
                            <div className="mb-3">
                                <strong>Reputation:</strong> 1000
                            </div>
                            {aboutMe && (
                                <div className="mb-3">
                                    <strong>About Me:</strong> {aboutMe}
                                </div>
                            )}
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
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <h3 className="card-title">Badges</h3>
                    <div className="mb-3">
                        {dummyBadges.map((badge, index) => (
                            <span key={index} className="badge bg-primary me-1">{badge}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-body">
                    <h3 className="card-title">Activity History</h3>
                    <ul>
                        {dummyActivity.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
