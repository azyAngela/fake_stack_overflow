import {  useEffect, useState } from "react";

const Main = ({search = "", passpage = "home"}) => {
    const [page, setPage] = useState(passpage)
    useEffect(() => {
        setPage(passpage);
    }, [passpage]);

    let content = null;
    const getQuestionPage = () => {
        return (
            <div>
                Question List
            </div>
        );
    };

    switch (page) {
        case "home": {
            content = getQuestionPage(search);
            break;
        }
        case "login":
            content = <div>Login Page</div>;
            break;
        case "signup":
            content = <div>Sign Up Page</div>;
            break;
        default:
            content = getQuestionPage();
            break;
    }


    return (
        <div id="main" className="main">
            <div id="right_main" className="right_main">
                {content}
            </div>
        </div>
    );



};
export default Main;