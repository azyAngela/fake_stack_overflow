import { useState } from "react";
import "./index.css";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../utlis/userprovider";
const Header = ({search}) => {
    const [val, setVal] = useState(search);
    const navigate = useNavigate();

    const jumpLogin = () => { navigate('/login'); }
    const jumpProfile = () => { navigate('/profile'); }
    const jumpSignUp = () => { navigate('/signup'); }   
    const {  user } = useUser();
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
            {!user && <div className="button-group">
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
            </div>}
            {user && <div className="button-group"> <button
                    id="loginButton"
                    className="btn"
                    onClick={jumpProfile}>
                    {user.username}
                </button></div>}
            
        </div>
    );
};

export default Header;
