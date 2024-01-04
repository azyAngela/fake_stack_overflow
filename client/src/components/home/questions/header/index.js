import React from "react";

import { useUser } from "../../../../context/user";
import "./index.css";
import OrderButton from "./orderButton";
import { useNavigate } from "react-router";

const QuestionHeader = ({ title_text, qcnt }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    return (
        <div className="right_main_header">
            <div className="space_between right_padding">
                <div className="bold_title">{title_text}</div>
                {user && (
                    <button
                        className="bluebtn"
                        onClick={() => {
                            navigate("/home/newQuestion");
                        }}
                    >
                        Ask a Question
                    </button>
                )}
            </div>
            <div className="space_between right_padding">
                <div id="question_count">{qcnt} questions</div>
                <div className="btns">
                    {["Newest", "Active", "Unanswered"].map((m, idx) => (
                        <OrderButton key={idx} message={m} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuestionHeader;
