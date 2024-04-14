import { useState } from "react";
import "./index.css";
import { useNavigate } from 'react-router-dom';

const Header = ({search}) => {
    const [val, setVal] = useState(search);
    const navigate = useNavigate();

    const jumpLogin = () => { navigate('/login'); }
    const jumpSignUp = () => { navigate('/signup'); }   

    return (
        <div id="header" className="header">
            <div className="title" onClick={
                () => {
                    navigate('/');
                }
            
            }>Fake Stack Overflow</div>
            <input
                id="searchBar"
                placeholder="Search ..."
                type="text"
                value={val}
                onChange={(e) => {
                    setVal(e.target.value);
                }}
            />
            <div className="button-group">
                <button
                    id="loginButton"
                    className="btn"
                    onClick={jumpLogin}>
                    Login
                </button>
                <button
                    id="signUpButton"
                    className="btn"
                    onClick={jumpSignUp}>
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default Header;
