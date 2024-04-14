import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import CreatePost from '../newQuestion';

const PostList = () => {
  const [allPosts, setAllPosts] = useState([
    // Dummy posts data
    {
      id: 1,
      title: 'How to use React Router',
      overview: 'Learn how to implement React Router in your project.',
      author: 'John Doe',
      postDate: '2022-04-15',
      tags: ['React', 'React Router', 'Routing'],
      votes: 0
    },
    {
      id: 2,
      title: 'Introduction to Redux',
      overview: 'Understanding the basics of Redux state management.',
      author: 'Jane Smith',
      postDate: '2022-04-16',
      tags: ['React', 'Redux', 'State Management'],
      votes: 0
    },
  ]);

  const handleVote = (postId, voteType) => {
    const updatedPosts = allPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          votes: voteType === 'upvote' ? post.votes + 1 : post.votes - 1
        };
      }
      return post;
    });
    setAllPosts(updatedPosts);
  };

  // const addNewPost = (newPost) => {
  //   setAllPosts([...allPosts, newPost]);
  // };

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">All Posts</h2>
        </div>
        {/* <CreatePost addNewPost={addNewPost} /> */}
        <div className="col-md-6 d-flex justify-content-end">
          <Link to="/newquestion" className="btn btn-primary">Create New Post</Link>
        </div>
      </div>
      {allPosts.map(post => (
        <div key={post.id} className="card mb-3">
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 d-flex flex-column align-items-center">
                <button className="btn btn-outline-primary btn-sm mb-2" onClick={() => handleVote(post.id, 'upvote')}>Upvote</button>
                <div className="vote-count mb-2">{post.votes}</div>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleVote(post.id, 'downvote')}>Downvote</button>
              </div>
              <div className="col-md-6">
                <Link to={`/posts/${post.id}`} className="text-decoration-none text-dark">
                  <h3 className="card-title">{post.title}</h3>
                </Link>
                <p className="card-text">{post.overview}</p>
                <div className="tags mt-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="badge bg-primary me-1">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <div>{`Author: ${post.author}`}</div>
                  <div>{`Posted on: ${post.postDate}`}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
