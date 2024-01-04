import React, { useEffect, useState } from "react";
import "./index.css";
import { getTagsWithQuestionNumber } from "../../../service/tag";
import { useUser } from "../../../context/user";
import { useNavigate } from "react-router";
import TagList from "./tagList";

const Tags = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [tlist, setTlist] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            let res = await getTagsWithQuestionNumber();
            setTlist(res.data || []);
        };

        fetchData().catch((e) => console.log(e));
    }, []);
    return (
        <>
            <div className="space_between right_padding tag_header">
                <div className="bold_title">{tlist.length} Tags</div>
                <div className="bold_title">All Tags</div>
                {user ? (
                    <button
                        className="bluebtn"
                        onClick={() => {
                            navigate("/home/newQuestion");
                        }}
                    >
                        Ask a Question
                    </button>
                ) : (
                    <div></div>
                )}
            </div>
            <div className="tags_list">
                <TagList tlist={tlist} />
            </div>
        </>
    );
};

export default Tags;
