import React, { useEffect, useState } from "react";
import { handleHyperlink } from "../../../../tool";
import "./index.css";
import Comments from "../../../baseComponents/comments";
import Upvote from "../../../baseComponents/vote/upvote";
import Downvote from "../../../baseComponents/vote/downvote";
import { useUser } from "../../../../context/user";
import {
    upvote as _upvote,
    downvote as _downvote,
    postComment as _postComment,
} from "../../../../service/answer";
import AddComment from "../../../baseComponents/addComment";
import Tick from "../../../baseComponents/tick";

// Component for the Answer Page in the React
const Answer = ({
    qid,
    aid,
    text,
    voted,
    ansBy,
    meta,
    comments = [],
    accpted = false,
    asked_by,
    acceptAns,
}) => {
    const { user, token } = useUser();
    const [voteSt, setVoteSt] = useState(0);
    const [commentList, setCommentList] = useState([]);
    useEffect(() => {
        setVoteSt(voted);
        setCommentList(comments);
    }, [qid, aid, voted, accpted]);

    const upvote = async () => {
        const res = await _upvote(qid, aid, token);
        if (res.status == 200 && res.data.qid && res.data.aid) {
            setVoteSt((pre) => pre + 1);
        }
    };

    const downvote = async () => {
        const res = await _downvote(qid, aid, token);
        if (res.status == 200 && res.data.qid && res.data.aid) {
            setVoteSt((pre) => pre - 1);
        }
    };

    const postComment = async (text) => {
        const res = await _postComment(qid, aid, text, token);
        if (res.status == 200 && res.data._id) {
            let cpClist = JSON.parse(JSON.stringify(commentList));
            cpClist.unshift(res.data);
            setCommentList(cpClist);
        }
    };

    return (
        <div className="answer_main">
            <div className="answer right_padding">
                {accpted && <Tick />}
                <div id="answerText" className="answerText">
                    {handleHyperlink(text)}
                </div>
                {user && (
                    <div className="answer_vote">
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
                        {asked_by == user && (
                            <button
                                className="gray_btn"
                                disabled={accpted}
                                onClick={() => {
                                    acceptAns(aid);
                                }}
                            >
                                accept
                            </button>
                        )}
                    </div>
                )}
                <div className="answerAuthor">
                    <div className="answer_author">{ansBy}</div>
                    <div className="answer_question_meta">{meta}</div>
                    <div className="answer_question_meta">{voteSt} votes</div>
                </div>
            </div>
            {commentList.length > 0 && (
                <Comments comments={commentList} qid={qid} />
            )}
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

export default Answer;
