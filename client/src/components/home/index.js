import React from "react";
import "./index.css";
import Header from "./header";
import SideBarNav from "./sideBarNav";
import { Route, Routes, useNavigate } from "react-router";
import Questions from "./questions";
import Tags from "./tags";
import NewQuestion from "./newQuestion";
import Answers from "./answers";
import NewAnswer from "./newAnswer";
import Profile from "./profile";
import { useUser } from "../../context/user";
import { addQuestion as _addQuestion } from "../../service/question";
import { addAnswer as _addAnswer } from "../../service/answer";

const Home = () => {
    const navigate = useNavigate();
    const { token } = useUser();
    const postQuestion = async (question) => {
        const res = await _addQuestion(question, token);
        if (res.status == 200 && res.data._id) {
            navigate("/home");
        }
    };

    const postAnswer = async (ans, qid) => {
        const res = await _addAnswer(ans, qid, token);

        if (res.status == 200 && res.data.aid) {
            navigate(`/home/answers/${qid}`);
        }
    };

    return (
        <>
            <Header />
            <div id="main" className="main">
                <SideBarNav />
                <div id="right_main" className="right_main">
                    <Routes>
                        <Route path="/" element={<Questions />} />
                        <Route path="question" element={<Questions />} />
                        <Route path="tag" element={<Tags />} />
                        <Route
                            path="newQuestion"
                            element={<NewQuestion handlePost={postQuestion} />}
                        />
                        <Route path="answers/:qid" element={<Answers />} />
                        <Route
                            path="newAnswer/:qid"
                            element={<NewAnswer handlePost={postAnswer} />}
                        />
                        <Route path="profile/*" element={<Profile />} />
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default Home;
