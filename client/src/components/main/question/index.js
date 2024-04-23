import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PostItem from './postItem';
import { getCsrfToken } from '../services/profile';
import { getQuestionList, upvoteQuestion, downvoteQuestion} from '../services/question';
import { filterPosts } from '../../../utlis/helper';
import checkLoginStatus from '../services/checkLoginStatus'; // Import the checkLoginStatus function

const PostList = ({search}) => {
  const [allPosts, setAllPosts] = useState([]);
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [votedPosts, setVotedPosts] = useState({});
  const [loggedIn, setLoggedIn] = useState(false); // State to track login status

  const fetchCsrfToken = useCallback(async () => {
    try {
      const response = await getCsrfToken();
      setCsrfToken(response);
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  }, []);

  useEffect(() => {
    const fetchCsrf = async () => {
      await fetchCsrfToken();
    };
    fetchCsrf();
  }, [fetchCsrfToken]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestionList();
        setAllPosts(response.data); // Update allPosts state with fetched data
      } catch (error) {
        setError('Error fetching question:', error.message);
      }
    };

    fetchQuestion();
  }, []);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedInStatus = await checkLoginStatus(); // Call the checkLoginStatus function
      setLoggedIn(loggedInStatus); // Update the login status state
    };

    checkLoggedIn();
  }, []);

  const handleVote = async (postId, voteType) => {
    try {
      const prevCount = votedPosts[postId] || 0;
  
      let increment = 0;

      // Check if the user is logged in before allowing voting
      if (!loggedIn) {
        console.log("loggedIn", loggedIn);
        setError('Please sign in first'); // Set an error message if not logged in
        return;
      }
  
      if (voteType === 'upvote') {
        if (prevCount === 0 || prevCount === 1) {
          increment = prevCount === 0 ? 1 : -1;
        }
      } else if (voteType === 'downvote') {
        if (prevCount === 0 || prevCount === -1) {
          increment = prevCount === 0 ? -1 : 1;
        }
      }
      let newNumber = 0;
      if (voteType === 'upvote') {
        const response = await upvoteQuestion(postId,increment, csrfToken);
        newNumber = response.data.upvotes;
      } else if (voteType === 'downvote') {
        const response = await downvoteQuestion(postId,increment, csrfToken);
        newNumber = response.data.upvotes;
      }

  
      setAllPosts(allPosts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            upvotes: newNumber
          };
        }
        return post;
      }));
  
      setVotedPosts(prevVotedPosts => ({
        ...prevVotedPosts,
        [postId]: prevCount + increment 
      }));
    } catch (error) {
      console.error('Failed to vote:', error);
      setError('Failed to vote');
    }
  };
  
  const filteredPosts = filterPosts(allPosts, search);


  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">All Posts</h2>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          {loggedIn && (
            <Link to="/newquestion" className="btn btn-primary">Create New Post</Link>
          )}
          
        </div>
      </div>
      {filteredPosts.map(post => (
        <PostItem key={post._id} post={post} handleVote={handleVote}
        loggedIn={loggedIn} />
      ))}
      {error && <div className="mt-3 text-danger">{error}</div>}
    </div>
  );
};

export default PostList;
