import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PostItem from './postItem';
import { getCsrfToken } from '../services/profile';
import { getQuestionList } from '../services/question';

const PostList = ({search}) => {
  const [allPosts, setAllPosts] = useState([]);
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [votedPosts, setVotedPosts] = useState({});

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
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, []);

  const handleVote = async (postId, voteType) => {
    try {
      const prevCount = votedPosts[postId] || 0;
  
      let increment = 0;
  
      if (voteType === 'upvote') {
        if (prevCount === 0 || prevCount === 1) {
          increment = prevCount === 0 ? 1 : -1;
        }
      } else if (voteType === 'downvote') {
        if (prevCount === 0 || prevCount === -1) {
          increment = prevCount === 0 ? -1 : 1;
        }
      }
  
      const response = await axios.put(`http://localhost:8000/question/${voteType}Question/${postId}`, { increment }, {
        headers: {
          'X-CSRF-Token': csrfToken
        },
        withCredentials: true,
      });
  
      setAllPosts(allPosts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            upvotes: response.data.upvotes 
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
    return keywords.some(keyword => post.title.toLowerCase().includes(keyword.toLowerCase()) || 
          keywords.some(keyword => post.text.toLowerCase().includes(keyword.toLowerCase()))) ||
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
        <PostItem key={post._id} post={post} handleVote={handleVote} />
      ))}
      {error && <div className="mt-3 text-danger">{error}</div>}
    </div>
  );
};

export default PostList;
