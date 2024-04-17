
import React, { useState } from "react";
import "./index.css";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../utlis/userprovider";

const Header = ({ search, handleSearch }) => {
    const [searchQuery, setSearchQuery] = useState(search);
    const navigate = useNavigate();
    const { user } = useUser();

    const handleSubmit = () => {
        handleSearch(searchQuery); // Call handleSearch function with the current search query
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
                        handleSubmit(); // Call handleSubmit when the Enter key is pressed
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



// import { useState } from "react";
// import "./index.css";
// import { useNavigate } from 'react-router-dom';
// import { useUser } from "../../utlis/userprovider";

// const Header = ({ search, setMainPage }) => {
//     const [searchQuery, setSearchQuery] = useState(search);
//     const navigate = useNavigate();
//     const { user } = useUser();

//     const handleSearch = () => {
//         const keywords = [];
//         const tags = [];
//         const words = searchQuery.split(" ");
        
//         words.forEach(word => {
//             if (word.startsWith("[") && word.endsWith("]")) {
//                 // Extract tags
//                 const tag = word.substring(1, word.length - 1);
//                 tags.push(tag);
//             } else {
//                 // Keywords
//                 keywords.push(word);
//             }
//         });
//     };

//     return (
//         <div id="header" className="header">
//             <div className="title" onClick={() => navigate('/')}>
//                 Fake Stack Overflow
//             </div>
//             <input
//                 id="searchBar"
//                 placeholder="Search ..."
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                         e.preventDefault();
//                         handleSearch();
//                     }
//                 }}
//             />
//             {!user && (
//                 <div className="button-group">
//                     <button id="loginButton" className="btn" onClick={() => navigate('/login')}>
//                         Login
//                     </button>
//                     <button id="signUpButton" className="btn" onClick={() => navigate('/signup')}>
//                         Sign Up
//                     </button>
//                 </div>
//             )}
//             {user && (
//                 <div className="button-group">
//                     <button id="loginButton" className="btn" onClick={() => navigate('/profile')}>
//                         {user.username}
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Header;

