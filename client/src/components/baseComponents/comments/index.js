import React, { useEffect, useState } from "react";
import "./index.css";
import Pagination from "../pagination";
import Upvote from "../vote/upvote";
import { useUser } from "../../../context/user";

import { upvote as _upvote } from "../../../service/comment";

const Comments = ({ comments, qid }) => {
    const { user, token } = useUser();
    const [clist, setClist] = useState([]);
    const [showList, setShowList] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    useEffect(() => {
        setClist(comments);
        setStartIndex(0);
        setShowList(comments.slice(0, 3));
    }, [comments]);

    const upvote = async (cid) => {
        const res = await _upvote(qid, cid, token);
        if (res.status == 200 && res.data.cid && res.data.qid) {
            let cpclist = clist;
            cpclist = cpclist.map((c) =>
                c._id === cid ? { ...c, voted: c.voted + 1 } : c
            );
            setClist(cpclist);
            setShowList(cpclist.slice(startIndex, startIndex + 3));
        }
    };
    return (
        <>
            <div className="comments">
                <div className="comments_body">
                    {showList.map((c, idx) => (
                        <div className="comment_item" key={idx}>
                            <div>{c.text}</div>
                            <div className="comment_item_right">
                                {user && (
                                    <Upvote
                                        handleClick={() => {
                                            upvote(c._id);
                                        }}
                                    />
                                )}
                                <div>{c.voted} votes</div>
                                <div>{c.commented_by.username} </div>
                            </div>
                        </div>
                    ))}
                </div>
                {clist.length > 3 && (
                    <Pagination
                        curStart={startIndex}
                        prev={() => {
                            setStartIndex((cur) => {
                                let next = Math.max(0, cur - 3);
                                setShowList(clist.slice(next, next + 3));
                                return next;
                            });
                        }}
                        next={() => {
                            setStartIndex((cur) => {
                                let next = cur + 3;
                                if (next >= clist.length) {
                                    next = 0;
                                }
                                setShowList(clist.slice(next, next + 3));
                                return next;
                            });
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default Comments;
