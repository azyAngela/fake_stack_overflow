
import React, { useState } from "react";
import "./index.css";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../utlis/userprovider";

const Header = ({ search, handleSearch }) => {
    const [searchQuery, setSearchQuery] = useState(search);
    const navigate = useNavigate();
    const { user } = useUser();

    const handleSubmit = () => {
        handleSearch(searchQuery); 
    };

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
                    <button id="loginButton" className="btn" onClick={() => navigate('/profile')}>
                        {user.username}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Header;