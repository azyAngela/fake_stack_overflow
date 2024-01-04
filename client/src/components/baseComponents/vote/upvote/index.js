import React from "react";
import "./index.css";

const Upvote = ({ handleClick }) => {
    return (
        <button
            className="gray_btn"
            onClick={() => {
                handleClick();
            }}
        >
            upvote
        </button>
    );
};

export default Upvote;
