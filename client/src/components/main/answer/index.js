import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PostDetail() {
  const [post, setPost] = useState(null);
  const qid = useParams().id;

  const [error, setError] = useState('');

  const [csrfToken, setCsrfToken] = useState('');

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
    } catch (error) {
      console.error('Failed to vote:', error);
      setError('Failed to vote');
    }
  };
  
  const handleAnswerVote = async (answerId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/answer/upvoteAnswer/${answerId}`,
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
        answers: prevPost.answers.map(answer => {
          if (answer.id === answerId) {
            return {
              ...answer,
              votes: response.data.votes // Assuming the backend returns the updated votes count
            };
          }
          return answer;
        })
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
            <div>{`Posted on: ${post.ask_date_time}`}</div>
          </div>
          <div className="mt-3">
            <button className="btn btn-outline-primary btn-sm" onClick={() => handlePostVote(post._id, 'upvote')}>Upvote</button>
            <span className="mx-2">{post.upvotes}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={() => handlePostVote(post._id, 'downvote')}>Downvote</button>
          </div>
        </div>
      </div>
      <h3>Answers</h3>
      {post.answers.map(answer => (
        <div key={answer.id} className="card mb-3">
          <div className="card-body">
            <p className="card-text">{answer.text}</p>
            <div className="mt-4">
              <div>{`Author: ${answer.username}`}</div>
              <div>{`Posted on: ${answer.answer_date_time}`}</div>
            </div>
            <div className="mt-3">
              <button className="btn btn-outline-primary btn-sm" onClick={() => handleAnswerVote(answer.id)}>Upvote</button>
              <span className="mx-2">{answer.upvotes}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleAnswerVote(answer.id)}>Downvote</button>
            </div>
          </div>
        </div>
      ))}
      {error && <div className="mt-3 text-danger">{error}</div>}
    </div>
  );
};

export default PostDetail;
