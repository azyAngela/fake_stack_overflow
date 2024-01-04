import React from "react";
import "./index.css";
import { useUser } from "../../../context/user";
import { useNavigate, useLocation } from "react-router";
import { logout as _logout } from "../../../service/user";

const SideBarNav = () => {
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const { pathname } = useLocation();
    const path = pathname.split("/");
    let selected = "";
    if (path.length == 2 || path[2].startsWith("question")) {
        selected = "q";
    } else if (path[2].startsWith("tag")) {
        selected = "t";
    } else if (path[2].startsWith("profile")) {
        selected = "p";
    }

    const handleLogout = async () => {
        const res = await _logout();
        if (res.status == 200) {
            logout();
            navigate("/");
        }
    };

    return (
        <div id="sideBarNav" className="sideBarNav">
            <div
                id="menu_welcome"
                className="menu_button"
                onClick={() => {
                    navigate("/");
                }}
            >
                Welcome
            </div>
            <div
                id="menu_question"
                className={`menu_button ${
                    selected === "q" ? "menu_selected" : ""
                }`}
                onClick={() => {
                    navigate("/home");
                }}
            >
                Questions
            </div>
            <div
                id="menu_tag"
                className={`menu_button ${
                    selected === "t" ? "menu_selected" : ""
                }`}
                onClick={() => {
                    navigate("/home/tag");
                }}
            >
                Tags
            </div>
            {user && (
                <>
                    <div
                        id="menu_profile"
                        className={`menu_button ${
                            selected === "p" ? "menu_selected" : ""
                        }`}
                        onClick={() => {
                            navigate("/home/profile");
                        }}
                    >
                        Profile
                    </div>
                    <div
                        id="menu_logout"
                        className="menu_button"
                        onClick={() => {
                            handleLogout();
                        }}
                    >
                        Logout
                    </div>
                </>
            )}
        </div>
    );
};

export default SideBarNav;
