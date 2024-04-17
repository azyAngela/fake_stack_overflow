import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getMetaData } from '../../../utlis/dateFormat';

const PostList = ({search}) => {
  const [allPosts, setAllPosts] = useState([]);
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [votedPosts, setVotedPosts] = useState({});

  const fetchCsrfToken = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/profile/csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
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
        const response = await axios.get('http://localhost:8000/question/getquestion');
        setAllPosts(response.data); // Update allPosts state with fetched data
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, []);

  const handleVote = async (postId, voteType) => {
    try {
      // Determine the correct endpoint based on the vote type
      const endpoint = voteType === 'upvote' ? `/upvoteQuestion/${postId}` : `/downvoteQuestion/${postId}`;

      // Check if the user has already voted on this post
      if (votedPosts[postId] === voteType) {
        console.log(`Already ${voteType} voted for this post`);
        return; // Exit the function if the user has already voted
      }

      // Make a PUT request to the backend endpoint
      await axios.put(`http://localhost:8000/question/${endpoint}`, null, {
        headers: {
          'X-CSRF-Token': csrfToken
        },
        withCredentials: true,
      });

      // Update the local state with the updated post data
      setAllPosts(allPosts.map(post => {
        if (post._id === postId) {
          // If the user previously upvoted this post, decrement the upvotes
          // If the user previously downvoted this post, increment the upvotes
          const newUpvotes = post.upvotes + (voteType === 'upvote' ? 1 : -1);
          return {
            ...post,
            upvotes: newUpvotes
          };
        }
        return post;
      }));

      // Update the votedPosts state to mark that the user has voted on this post
      setVotedPosts(prevVotedPosts => ({
        ...prevVotedPosts,
        [postId]: voteType
      }));
    } catch (error) {
      console.error('Failed to vote:', error);
      setError('Failed to vote');
    }
  };

  const filteredPosts = allPosts.filter(post => {
    const keywords = [];
    const tags = [];
    const words = search.split(" ");

    words.forEach(word => {
      if (word.startsWith("[") && word.endsWith("]")) {
        // Extract tags
        const tag = word.substring(1, word.length - 1);
        tags.push(tag);
      } else {
        // Keywords
        keywords.push(word);
      }
    });

    // Implement your filter logic here
    // For example, check if the post title or tags match the search query
    // This is a simplified example, you may need to adjust it based on your requirements
    return keywords.some(keyword => post.title.toLowerCase().includes(keyword.toLowerCase()) || keywords.some(keyword => post.text.toLowerCase().includes(keyword.toLowerCase()))) ||
          tags.some(tag => post.tags.includes(tag.toLowerCase()));
  });


  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">All Posts</h2>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <Link to="/newquestion" className="btn btn-primary">Create New Post</Link>
        </div>
      </div>
      {filteredPosts.map(post => (
        <div key={post._id} className="card mb-3">
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 d-flex flex-column align-items-center">
                <button className="btn btn-outline-primary btn-sm mb-2" onClick={() => handleVote(post._id, 'upvote')}>Upvote</button>
                <div className="vote-count mb-2">{post.upvotes}</div>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleVote(post._id, 'downvote')}>Downvote</button>
              </div>
              <div className="col-md-6">
                <Link to={`/posts/${post._id}`} className="text-decoration-none text-dark">
                  <h3 className="card-title">{post.title}</h3>
                </Link>
                <p className="card-text">{post.text}</p>
                <div className="tags mt-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="badge bg-primary me-1">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <div>{`asked by: ${post.asked_by}`}</div>
                  <div>{`asked ${getMetaData(new Date(post.ask_date_time))}`}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {error && <div className="mt-3 text-danger">{error}</div>}
    </div>
  );
};

export default PostList;
