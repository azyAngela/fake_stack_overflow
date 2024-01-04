import React, { useEffect, useState } from "react";
import { getMetaData } from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import "./index.css";
import QuestionBody from "./questionBody";
import { getQuestionById } from "../../../service/question";
import { useNavigate, useParams } from "react-router";
import { useUser } from "../../../context/user";
import Pagination from "../../baseComponents/pagination";
import { acceptAns as _acceptAns } from "../../../service/question";

// Component for the Answers page
const Answers = () => {
    const navigate = useNavigate();
    const { qid } = useParams();
    const { user, token } = useUser();
    const [question, setQuestion] = useState({});
    const [showAnsList, setShowAnsList] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [acceptedAns, setAcceptedAns] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            let res = await getQuestionById(qid);
            if (res.status == 200 && res.data) {
                const q = res.data;
                const { answers, accepted_ans = null } = q;
                let ansList = [];
                if (accepted_ans) {
                    q.answers = answers.filter(
                        (a) => a._id != accepted_ans._id
                    );
                    ansList.push(accepted_ans);
                }
                for (
                    let i = 0;
                    i < Math.min(accepted_ans ? 4 : 5, q.answers.length);
                    i++
                ) {
                    ansList.push(q.answers[i]);
                }
                setQuestion(q || {});
                setShowAnsList(ansList);
                setAcceptedAns(accepted_ans);
            }
        };
        fetchData().catch((e) => console.log(e));
    }, [qid]);

    const acceptAns = async (aid) => {
        const res = await _acceptAns(qid, aid, token);
        if (res.status == 200 && res.data._id) {
            const accepted_ans = res.data;
            let ansList = [];
            let q = JSON.parse(JSON.stringify(question));
            if (acceptedAns) {
                q.answers.unshift(acceptedAns);
            }
            q.answers = q.answers.filter((a) => a._id != aid);
            q.answers = q.answers.sort((a, b) => {
                if (a.createdAt > b.createdAt) {
                    return -1;
                } else if (a.createdAt < b.createdAt) {
                    return 1;
                } else {
                    return 0;
                }
            });
            ansList.push(accepted_ans);
            for (let i = 0; i < Math.min(4, q.answers.length); i++) {
                ansList.push(q.answers[i]);
            }
            setQuestion(q);
            setAcceptedAns(accepted_ans);
            setShowAnsList(ansList);
            setStartIndex(0);
        }
    };

    const updateList = (next) => {
        let step = acceptedAns ? 4 : 5;
        if (step === 5) {
            setShowAnsList(question.answers.slice(next, next + step));
        } else {
            let newList = [acceptedAns];
            for (
                let i = next;
                i < Math.min(next + step, question.answers.length);
                i++
            ) {
                newList.push(question.answers[i]);
            }
            setShowAnsList(newList);
        }
    };

    return (
        <>
            <AnswerHeader
                ansCount={
                    question && question.answers && question.answers.length
                }
                title={question && question.title}
                tags={question && question.tags}
            />
            <QuestionBody
                qid={qid}
                voted={question && question.voted}
                views={question && question.views}
                text={question && question.text}
                askby={
                    question && question.asked_by && question.asked_by.username
                }
                meta={question && getMetaData(new Date(question.createdAt))}
                comments={question && question.comments}
            />
            <div className="ans_list">
                {showAnsList &&
                    showAnsList.map((a, idx) => (
                        <Answer
                            key={idx}
                            qid={qid}
                            aid={a._id}
                            text={a.text}
                            voted={a.voted}
                            ansBy={a.ans_by && a.ans_by.username}
                            meta={getMetaData(new Date(a.createdAt))}
                            comments={a.comments}
                            accpted={acceptedAns && acceptedAns._id == a._id}
                            asked_by={question && question.asked_by.username}
                            acceptAns={acceptAns}
                        />
                    ))}
                {question &&
                    question.answers &&
                    question.answers.length + (acceptedAns == null ? 0 : 1) >
                        5 && (
                        <Pagination
                            curStart={startIndex}
                            prev={() => {
                                setStartIndex((cur) => {
                                    let next = Math.max(
                                        0,
                                        cur - (acceptedAns ? 4 : 5)
                                    );
                                    updateList(next);
                                    return next;
                                });
                            }}
                            next={() => {
                                setStartIndex((cur) => {
                                    let next = cur + (acceptedAns ? 4 : 5);
                                    if (next >= question.answers.length) {
                                        next = 0;
                                    }
                                    updateList(next);
                                    return next;
                                });
                            }}
                        />
                    )}
            </div>
            {user && (
                <button
                    className="bluebtn ansButton"
                    onClick={() => {
                        navigate(`/home/newAnswer/${qid}`);
                    }}
                >
                    Answer Question
                </button>
            )}
        </>
    );
};

export default Answers;
