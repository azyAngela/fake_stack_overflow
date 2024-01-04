import "./index.css";
import React, { useEffect, useState } from "react";
import { handleHyperlink } from "../../../../tool";
import Comments from "../../../baseComponents/comments";
import { useUser } from "../../../../context/user";
import Upvote from "../../../baseComponents/vote/upvote";
import Downvote from "../../../baseComponents/vote/downvote";
import {
  upvote as _upvote,
  downvote as _downvote,
  postComment as _postComment,
} from "../../../../service/question";
import AddComment from "../../../baseComponents/addComment";

// React Component for the Question's Body
const QuestionBody = ({
  qid,
  views,
  voted,
  text,
  askby,
  meta,
  comments = [],
}) => {
  const { user, token } = useUser();
  const [voteSt, setVoteSt] = useState(0);
  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    setVoteSt(voted);
    setCommentList(comments);
  }, [qid, voted]);

  const upvote = async () => {
    const res = await _upvote(qid, token);
    if (res.status == 200 && res.data.qid) {
      setVoteSt((pre) => pre + 1);
    }
  };

  const downvote = async () => {
    const res = await _downvote(qid, token);
    if (res.status == 200 && res.data.qid) {
      setVoteSt((pre) => pre - 1);
    }
  };

  const postComment = async (text) => {
    const res = await _postComment(qid, text, token);
    if (res.status == 200 && res.data._id) {
      let cpClist = JSON.parse(JSON.stringify(commentList));
      cpClist.unshift(res.data);
      setCommentList(cpClist);
    }
  };

  return (
    <div className="question_main">
      <div id="questionBody" className="questionBody right_padding">
        <div className="question_body_left">
          <div>
            <div className="view_votes">{views} views</div>
            <div className="view_votes">{voteSt} votes</div>
          </div>
          {user && (
            <div className="answer_question_vote">
              <Upvote
                handleClick={() => {
                  upvote();
                }}
              />
              <Downvote
                handleClick={() => {
                  downvote();
                }}
              />
            </div>
          )}
        </div>
        <div className="answer_question_text">{handleHyperlink(text)}</div>
        <div className="answer_question_right">
          <div className="question_author">{askby}</div>
          <div className="answer_question_meta">asked {meta}</div>
        </div>
      </div>
      {commentList.length > 0 && <Comments comments={commentList} qid={qid} />}
      {user && (
        <AddComment
          postComment={(text) => {
            postComment(text);
          }}
        />
      )}
    </div>
  );
};

export default QuestionBody;
