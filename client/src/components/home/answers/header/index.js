import React from "react";
import "./index.css";
import TagBtn from "../../../baseComponents/tagBtn";
import { useUser } from "../../../../context/user";
import { useNavigate } from "react-router";

// Header for the Answer page React
const AnswerHeader = ({ ansCount, title, tags = [] }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  return (
    <div
      id="answersHeader"
      className="space_between right_padding answer_header"
    >
      <div className="bold_title">{ansCount} answers</div>
      <div className="answer_question_title">
        <div className="bold_title">{title}</div>

        {tags.map((tag, idx) => {
          return <TagBtn key={idx} name={tag.name} />;
        })}
      </div>
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
  );
};

export default AnswerHeader;
