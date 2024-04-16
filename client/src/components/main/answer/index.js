import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { getMetaData } from '../../../utlis/dateFormat';

function PostDetail() {
  const [post, setPost] = useState(null);
  const qid = useParams().id;
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [votedPosts, setVotedPosts] = useState({});
  const [votedAnswers, setVotedAnswers] = useState({});

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
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/question/getQuestionById/${qid}`);
        console.log(response.data);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [qid]);

  const handlePostVote = async (qid, voteType) => {
    try {
      const endpoint = voteType === 'upvote' ? `/upvoteQuestion/${qid}` : `/downvoteQuestion/${qid}`;
      // Check if the user has already voted on this post
      if (votedPosts[qid] === voteType) {
        console.log(`Already ${voteType} voted for this post`);
        return; // Exit the function if the user has already voted
      }
      const response = await axios.put(
        `http://localhost:8000/question/${endpoint}`,
        null,
        {
          headers: {
            'X-CSRF-Token': csrfToken, // Include the CSRF token in the request headers
          },
          withCredentials: true, // Ensure credentials are sent with the request
        }
      );
      setPost(prevPost => ({
        ...prevPost,
        upvotes: response.data.upvotes // Assuming the backend returns the updated votes count
      }));
  
      // Update the votedPosts state to mark that the user has voted on this post
      setVotedPosts(prevVotedPosts => ({
        ...prevVotedPosts,
        [qid]: voteType
      }));
    } catch (error) {
      console.error('Failed to vote:', error);
      setError('Failed to vote');
    }
  };

  const handleAnswerVote = async (aid, voteType) => {
    try {
      const endpoint = voteType === 'upvote' ? `upvoteAnswer/${aid}` : `downvoteAnswer/${aid}`;
      
      // Check if the user has already voted on this answer
      if (votedAnswers[aid] === voteType) {
        console.log(`Already ${voteType} voted for this answer`);
        return; // Exit the function if the user has already voted
      }
  
      const response = await axios.post(
        `http://localhost:8000/answer/${endpoint}`,
        null,
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );
  
      setPost(prevPost => ({
        ...prevPost,
        answers: prevPost.answers.map(answer => {
          if (answer._id === aid) {
            return {
              ...answer,
              upvotes: response.data.upvotes // Assuming the backend returns the updated votes count
            };
          }
          return answer;
        })
      }));
  
      // Update the votedAnswers state to mark that the user has voted on this answer
      setVotedAnswers(prevVotedAnswers => ({
        ...prevVotedAnswers,
        [aid]: voteType
      }));
    } catch (error) {
      console.error('Failed to vote:', error);
      setError('Failed to vote');
    }
  };
  

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card mb-3">
        <div className="card-body">
          <h2 className="card-title">{post.title}</h2>
          <p className="card-text">{post.text}</p>
          <div className="tags mt-3">
            {post.tags.map(tag => (
              <span key={tag} className="badge bg-primary me-1">{tag}</span>
            ))}
          </div>
          <div className="mt-4">
            <div>{`Author: ${post.asked_by}`}</div>
            <div>{`Posted on: ${getMetaData(new Date(post.ask_date_time))}`}</div>
          </div>
          <div className="mt-3">
            <button className="btn btn-outline-primary btn-sm" onClick={() => handlePostVote(post._id, 'upvote')}>Upvote</button>
            <span className="mx-2">{post.upvotes}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={() => handlePostVote(post._id, 'downvote')}>Downvote</button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <h3>Answers</h3>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <Link to={`/newAnswer/${qid}`} className="btn btn-primary mb-3">Create an Answer</Link>
        </div>
      </div>
      {post.answers.map(answer => (
        <div key={answer._id} className="card mb-3">
          <div className="card-body">
            <p className="card-text">{answer.text}</p>
            <div className="mt-4">
              <div>{`answered by ${answer.ans_by}`}</div>
              <div>{`answered ${getMetaData(new Date(answer.ans_date_time))}`}</div>
            </div>
            <div className="mt-3">
              <button className="btn btn-outline-primary btn-sm" onClick={() => handleAnswerVote(answer._id, 'upvote')}>Upvote</button>
              <span className="mx-2">{answer.upvotes}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleAnswerVote(answer._id, 'downvote')}>Downvote</button>
            </div>
          </div>
        </div>
      ))}
      {error && <div className="mt-3 text-danger">{error}</div>}
    </div>
  );
};

export default PostDetail;
