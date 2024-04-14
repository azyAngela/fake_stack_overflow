import { useState } from "react";
import "./index.css";
const Header = ({search, setMainPage }) => {
    const [val, setVal] = useState(search);
    return (
        <div id="header" className="header">
            <div className="title">Fake Stack Overflow</div>
            <input
                id="searchBar"
                placeholder="Search ..."
                type="text"
                value={val}
                onChange={(e) => {
                    setVal(e.target.value);
                }}

            />
            <button
                id="loginButton"
                onClick={() => {
                    setMainPage(val, "login");
                }}>
                Login
            </button>
            <button
                id="signUpButton"
                onClick={() => {
                    setMainPage(val, "signup");
                }}>
                Sign Up
            </button>
        </div>
    );
};

export default Header;
