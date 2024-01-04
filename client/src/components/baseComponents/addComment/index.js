import React, { useState } from "react";
import "./index.css";

const AddComment = ({ postComment }) => {
    const [text, setText] = useState("");
    return (
        <div className="add_comment">
            <input
                className="add_comment_input"
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                }}
            />
            <button
                className="add_comment_button"
                onClick={() => {
                    if (!text) {
                        alert("Comment cannot be empty!");
                    } else if (text.length > 140) {
                        alert("Comment length cannot more than 140 characters");
                    } else {
                        postComment(text);
                    }
                }}
            >
                comment
            </button>
        </div>
    );
};

export default AddComment;
