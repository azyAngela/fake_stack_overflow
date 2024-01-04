import React, { useEffect, useState } from "react";
import "./index.css";
import { getUserQuestions as _getUserQuestions } from "../../../../service/question";
import { useUser } from "../../../../context/user";
import { useNavigate } from "react-router";
import Pagination from "../../../baseComponents/pagination";

const Questions = () => {
    const navigate = useNavigate();
    const { user, logout, token } = useUser();
    const [qlist, setQlist] = useState([]);
    const [showList, setShowList] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            const res = await _getUserQuestions(token);
            if (res.status == 200) {
                setQlist(res.data);
                setShowList(res.data.slice(startIndex, startIndex + 5));
            } else {
                logout();
                alert("Login info Error");
                navigate("/");
            }
        };
        fetchData().catch((e) => console.log(e));
    }, [user]);
    return (
        <>
            <div className="profile_list">
                {showList.map((q, idx) => (
                    <div
                        className="profile_item"
                        key={idx}
                        onClick={() => {
                            navigate("/home/profile/editQuestion", {
                                state: { q: q },
                            });
                        }}
                    >
                        {q.title}
                    </div>
                ))}
            </div>
            {qlist.length > 5 && (
                <Pagination
                    curStart={startIndex}
                    prev={() => {
                        setStartIndex((cur) => {
                            let next = Math.max(0, cur - 5);
                            setShowList(qlist.slice(next, next + 5));
                            return next;
                        });
                    }}
                    next={() => {
                        setStartIndex((cur) => {
                            let next = cur + 5;
                            if (next >= qlist.length) {
                                next = 0;
                            }
                            setShowList(qlist.slice(next, next + 5));
                            return next;
                        });
                    }}
                />
            )}
        </>
    );
};

export default Questions;
