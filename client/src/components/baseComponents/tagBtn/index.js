import React from "react";
import "./index.css";

const TagBtn = ({ name, onClick = () => {} }) => {
    return (
        <button
            className="tag_button"
            onClick={(e) => {
                onClick(e);
            }}
        >
            {name}
        </button>
    );
};

export default TagBtn;
