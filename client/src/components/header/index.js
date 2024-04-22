
import React, { useState } from "react";
import "./index.css";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../utlis/userprovider";
import { updateProfile } from "../main/services/profile";

const Header = ({ search, handleSearch }) => {
    const [searchQuery, setSearchQuery] = useState(search);
    const navigate = useNavigate();
    const { user,setUser,csrfToken } = useUser();

    const handleSubmit = () => {
        handleSearch(searchQuery); 
    };
    const handleProfile = async() => {
        const response = await updateProfile(user, csrfToken);
        setUser(response.user);
        navigate('/profile');
    }

    return (
        <div id="header" className="header">
            <div className="title" onClick={() => navigate('/')}>
                Fake Stack Overflow
            </div>
            <input
                id="searchBar"
                placeholder="Search ..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit(); 
                    }
                }}
            />
            {!user && (
                <div className="button-group">
                    <button id="loginButton" className="btn" onClick={() => navigate('/login')}>
                        Login
                    </button>
                    <button id="signUpButton" className="btn" onClick={() => navigate('/signup')}>
                        Sign Up
                    </button>
                </div>
            )}
            {user && (
                <div className="button-group">
                    <button id="profileButton" className="btn" onClick={handleProfile}>
                        {user.username}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Header;