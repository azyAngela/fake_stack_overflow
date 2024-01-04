import React from "react";
import "./index.css";
import TagItem from "../tagItem";

const TagList = ({ tlist, fromProfile = false }) => {
    return (
        <div className="tag_list right_padding">
            {tlist.map((t, idx) => (
                <TagItem key={idx} t={t} fromProfile={fromProfile} />
            ))}
        </div>
    );
};

export default TagList;
