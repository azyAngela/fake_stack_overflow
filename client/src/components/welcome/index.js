import React from "react";
import "./index.css";
import CLink from "../baseComponents/link";
import { useUser } from "../../context/user";

const Weilcome = () => {
    const { user } = useUser();
    return (
        <div className="welcome_main">
            <h1>Fake Stack Overflow</h1>
            <CLink
                className={"blue_btn margin_top_50"}
                target={"register"}
                text={"Register"}
            />
            <CLink
                className={"blue_btn margin_top_50"}
                target={"login"}
                text={"Login"}
            />
            <CLink
                className={"blue_btn margin_top_50"}
                target={"home"}
                text={user ? "Home" : "Guest"}
            />
        </div>
    );
};

export default Weilcome;
