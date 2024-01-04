import React from "react";
import "./index.css";

const Downvote = ({ handleClick }) => {
    return (
        <button
            className="gray_btn"
            onClick={() => {
                handleClick();
            }}
        >
            downvote
        </button>
    );
};

export default Downvote;
