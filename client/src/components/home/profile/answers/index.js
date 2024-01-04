import React, { useState, useEffect } from "react";
import "./index.css";
import { useNavigate } from "react-router";
import { getUserAnswers as _getUserAnswers } from "../../../../service/answer";
import { useUser } from "../../../../context/user";
import Pagination from "../../../baseComponents/pagination";

const Answers = () => {
    const navigate = useNavigate();
    const { user, logout, token } = useUser();
    const [alist, setAlist] = useState([]);
    const [showList, setShowList] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            const res = await _getUserAnswers(token);
            if (res.status == 200) {
                setAlist(res.data);
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
                {showList.map((a, idx) => (
                    <div
                        className="profile_item"
                        key={idx}
                        onClick={() => {
                            navigate("/home/profile/editAnswer", {
                                state: { a: a },
                            });
                        }}
                    >
                        {a.text.slice(0, 50)}
                    </div>
                ))}
            </div>
            {alist.length > 5 && (
                <Pagination
                    curStart={startIndex}
                    prev={() => {
                        setStartIndex((cur) => {
                            let next = Math.max(0, cur - 5);
                            setShowList(alist.slice(next, next + 5));
                            return next;
                        });
                    }}
                    next={() => {
                        setStartIndex((cur) => {
                            let next = cur + 5;
                            if (next >= alist.length) {
                                next = 0;
                            }
                            setShowList(alist.slice(next, next + 5));
                            return next;
                        });
                    }}
                />
            )}
        </>
    );
};

export default Answers;
