import React from "react";
import { getMetaData } from "../../../../tool";
import "./index.css";
import { useNavigate } from "react-router";
import TagBtn from "../../../baseComponents/tagBtn";

const QuestionItem = ({ q }) => {
    const navigate = useNavigate();
    return (
        <div
            className="question right_padding"
            onClick={() => {
                navigate(`/home/answers/${q._id}`);
            }}
        >
            <div className="postStats">
                <div>{q.answers.length || 0} answers</div>
                <div>{q.voted} votes</div>
                <div>{q.views} views</div>
            </div>
            <div className="question_mid">
                <div className="postTitle">{q.title}</div>
                <div className="postSummary">{q.text}</div>
                <div className="question_tags">
                    {q.tags.map((tag, idx) => {
                        return (
                            <TagBtn
                                key={idx}
                                name={tag.name}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate({
                                        pathname: "/home/question",
                                        search: `keyword=[${tag.name}]&from=tag`,
                                    });
                                }}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="lastActivity">
                <div className="question_author">{q.asked_by.username}</div>
                <div>&nbsp;</div>
                <div className="question_meta">
                    asked {getMetaData(new Date(q.createdAt))}
                </div>
            </div>
        </div>
    );
};

export default QuestionItem;
