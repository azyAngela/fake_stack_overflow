import React, { useEffect, useState } from "react";
import "./index.css";
import { useLocation } from "react-router";
import { getQuestionsByFilter } from "../../../service/question";
import QuestionHeader from "./header";
import QuestionItem from "./questionItem";
import Pagination from "../../baseComponents/pagination";

const Questions = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [qlist, setQlist] = useState([]);
    const [showList, setShowList] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const order = queryParams.get("order") || "";
    const keyword = queryParams.get("keyword") || "";
    const from = queryParams.get("from") || "";
    let title = "All Questions";
    if (from === "search") {
        title = "Search Results";
    } else if (from === "tag") {
        title = keyword.slice(1, -1);
    }
    useEffect(() => {
        const fetchData = async () => {
            const res = await getQuestionsByFilter(order, keyword);
            const list = res.data;
            setQlist(list || []);
            setShowList(list.slice(startIndex, startIndex + 5));
        };

        fetchData().catch((e) => console.log(e));
    }, [order, keyword]);

    return (
        <>
            <QuestionHeader title_text={title} qcnt={qlist.length} />
            <div className="right_main_main">
                <div id="question_list" className="question_list">
                    {showList.map((q, idx) => (
                        <QuestionItem key={idx} q={q} />
                    ))}
                </div>
                {from === "search" && !qlist.length && (
                    <div className="bold_title right_padding">
                        No Questions Found
                    </div>
                )}
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
            </div>
        </>
    );
};

export default Questions;
