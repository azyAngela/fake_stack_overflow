import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './login';
import SignUp from './signUp';
import PostList from './question';
import ProfilePage from './profile';
import NewQuestion from './newQuestion';
import PostDetail from './answer';
import NewAnswer from './newAnswer';


const Main = ({search}) => {
  return (
      <div id="main" className="main">
        <div id="right_main" className="right_main">
          <Routes>
            <Route path="/" element={<PostList search={search} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/newquestion" element={<NewQuestion />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/newanswer/:qid" element={<NewAnswer />} />
          </Routes>
        </div>
      </div>
  );
};

export default Main;
