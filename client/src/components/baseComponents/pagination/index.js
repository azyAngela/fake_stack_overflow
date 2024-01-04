import React from "react";
import "./index.css";

const Pagination = ({ curStart, prev, next }) => {
    return (
        <div className="page_main">
            <button
                className="page_button"
                disabled={curStart === 0}
                onClick={() => {
                    prev();
                }}
            >
                prev
            </button>
            <button
                className="page_button gray_btn"
                onClick={() => {
                    next();
                }}
            >
                next
            </button>
        </div>
    );
};

export default Pagination;
