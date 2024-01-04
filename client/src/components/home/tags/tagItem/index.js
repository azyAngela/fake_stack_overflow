import React from "react";
import { useNavigate } from "react-router";
import "./index.css";

const TagItem = ({ t, fromProfile }) => {
    const navigate = useNavigate();
    return (
        <div
            className="tagNode"
            onClick={() => {
                if (!fromProfile) {
                    navigate({
                        pathname: "/home/question",
                        search: `keyword=[${t.name}]&from=tag`,
                    });
                } else {
                    navigate("/home/profile/editTag", {
                        state: { t },
                    });
                }
            }}
        >
            <div className="tagName">{t.name}</div>
            <div>{t.qcnt} questions</div>
        </div>
    );
};

export default TagItem;
