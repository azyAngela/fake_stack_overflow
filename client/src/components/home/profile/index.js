import React, { useEffect, useState } from "react";
import "./index.css";
import { useUser } from "../../../context/user";
import { getUserInfo as _getUserInfo } from "../../../service/user";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import UserInfo from "./userInfo";
import Questions from "./questions";
import Tags from "./tags";
import Answers from "./answers";
import NewQuestion from "../newQuestion";
import {
    editQuestion as _editQuestion,
    deleteQuestion as _deleteQuestion,
} from "../../../service/question";
import {
    editAnswer as _editAnswer,
    deleteAnswer as _deleteAnswer,
} from "../../../service/answer";
import NewAnswer from "../newAnswer";
import EditTag from "./editTag";

const Profile = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const path = pathname.split("/");
    const [select, setSelect] = useState(path.length > 3 ? path[3] : "");
    const { user, token, logout } = useUser();
    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const res = await _getUserInfo(token);
            if (res.status == 200 && res.data.username === user) {
                setUserInfo(res.data);
            } else {
                logout();
                alert("Login info Error");
                navigate("/");
            }
        };
        fetchData().catch((e) => console.log(e));
    }, [user]);

    const getDays = (date) => {
        const cur = new Date();
        const target = new Date(date);
        let diff_time = cur.getTime() - target.getTime();
        return Math.round(diff_time / (1000 * 3600 * 24));
    };

    const saveQuestion = async (question) => {
        const res = await _editQuestion(question, token);
        if (res.status == 200 && res.data.qid) {
            alert("Save success!");
            navigate("/home/profile/questions");
        }
    };

    const deleteQuestion = async (qid) => {
        const res = await _deleteQuestion(qid, token);
        if (res.status == 200) {
            alert("Delete success!");
            navigate("/home/profile/questions");
        }
    };

    const saveAnswer = async (answer) => {
        const res = await _editAnswer(answer, token);
        if (res.status == 200 && res.data.aid) {
            alert("Save success!");
            navigate("/home/profile/answers");
        }
    };

    const deleteAnswer = async (aid) => {
        const res = await _deleteAnswer(aid, token);
        if (res.status == 200) {
            alert("Delete success!");
            navigate("/home/profile/answers");
        }
    };

    return (
        <div className="right_padding profile">
            <div className="bold_title profile_space_evenly profile_header">
                <div>{userInfo && userInfo.username}</div>
                <div>
                    Membership duration:{" "}
                    {userInfo && getDays(userInfo.createdAt)} days
                </div>
                <div>reputation: {userInfo && userInfo.reputation}</div>
            </div>
            <div className="profile_space_evenly profile_links">
                <div
                    className={`profile_link ${
                        select == "info" ? "profile_link_selected" : ""
                    }`}
                    onClick={() => {
                        navigate("/home/profile/info");
                        setSelect("info");
                    }}
                >
                    user info
                </div>
                <div
                    className={`profile_link ${
                        select == "questions" ? "profile_link_selected" : ""
                    }`}
                    onClick={() => {
                        navigate("/home/profile/questions");
                        setSelect("questions");
                    }}
                >
                    posted questions
                </div>
                <div
                    className={`profile_link ${
                        select == "tags" ? "profile_link_selected" : ""
                    }`}
                    onClick={() => {
                        navigate("/home/profile/tags");
                        setSelect("tags");
                    }}
                >
                    created tags
                </div>
                <div
                    className={`profile_link ${
                        select == "answers" ? "profile_link_selected" : ""
                    }`}
                    onClick={() => {
                        navigate("/home/profile/answers");
                        setSelect("answers");
                    }}
                >
                    posted answers
                </div>
            </div>
            <div className="profile_routes">
                <Routes>
                    <Route
                        path="info"
                        element={
                            <UserInfo
                                username={userInfo && userInfo.username}
                                email={userInfo && userInfo.email}
                            />
                        }
                    />
                    <Route path="questions" element={<Questions />} />
                    <Route path="tags" element={<Tags />} />
                    <Route path="answers" element={<Answers />} />
                    <Route
                        path="editQuestion"
                        element={
                            <NewQuestion
                                handlePost={saveQuestion}
                                handleDelete={deleteQuestion}
                            />
                        }
                    />
                    <Route
                        path="editAnswer"
                        element={
                            <NewAnswer
                                handlePost={saveAnswer}
                                handleDelete={deleteAnswer}
                            />
                        }
                    />
                    <Route path="editTag" element={<EditTag />} />
                </Routes>
            </div>
        </div>
    );
};

export default Profile;
