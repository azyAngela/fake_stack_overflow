import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './login';
import SignUp from './signUp';
import PostList from './question';
import ProfilePage from './profile';
import NewQuestion from './newQuestion';
import store from '../../store';
import { Provider } from 'react-redux';
const Main = () => {
  return (
    <Provider store={store}>
    <div id="main" className="main">
      <div id="right_main" className="right_main">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/newquestion" element={<NewQuestion />} />
        </Routes>
      </div>
    </div>
    </Provider>
  );
};

export default Main;

// import {  useEffect, useState } from "react";
// import Login from "./login";
// import SignUp from "./signUp";

// const Main = ({search = "", passpage = "home"}) => {
//     const [page, setPage] = useState(passpage)
//     useEffect(() => {
//         setPage(passpage);
//     }, [passpage]);

//     let content = null;
//     const getQuestionPage = () => {
//         return (
//             <div>
//                 Question List
//             </div>
//         );
//     };

//     const getLoginPage = () => {
//         return (
//             <Login />
//         );
//     };

//     switch (page) {
//         case "home": {
//             content = getQuestionPage(search);
//             break;
//         }
//         case "login":
//             content = getLoginPage();
//             break;
//         case "signup":
//             content = <SignUp />;
//             break;
//         default:
//             content = getQuestionPage();
//             break;
//     }


//     return (
//         <div id="main" className="main">
//             <div id="right_main" className="right_main">
//                 {content}
//             </div>
//         </div>
//     );



// };
// export default Main;