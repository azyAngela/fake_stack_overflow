import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { getMetaData } from '../../../utlis/dateFormat';
import { getCsrfToken } from '../services/profile';
import { fetchQuestion } from '../services/question';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [votedPosts, setVotedPosts] = useState({});
  const [votedAnswers, setVotedAnswers] = useState({});
  const [editingText, setEditingText] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedAnswerText, setEditedAnswerText] = useState('');

  const qid = useParams().id;

  const fetchCsrfToken = useCallback(async () => {
    try {
      const response = getCsrfToken();
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
    const fetchPost = async () => {
      try {
        const response = await fetchQuestion(qid);
        setPost(response);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [qid]);

  const handlePostVote = async (qid, voteType) => {
    try {
      const endpoint = voteType === 'upvote' ? `/upvoteQuestion/${qid}` : `/downvoteQuestion/${qid}`;
      if (votedPosts[qid] === voteType) {
        console.log(`Already ${voteType} voted for this post`);
        return;
      }
      const response = await axios.put(
        `http://localhost:8000/question/${endpoint}`,
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
        upvotes: response.data.upvotes
      }));
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
      if (votedAnswers[aid] === voteType) {
        console.log(`Already ${voteType} voted for this answer`);
        return;
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
              upvotes: response.data.upvotes
            };
          }
          return answer;
        })
      }));
      setVotedAnswers(prevVotedAnswers => ({
        ...prevVotedAnswers,
        [aid]: voteType
      }));
    } catch (error) {
      console.error('Failed to vote:', error);
      setError('Failed to vote');
    }
  };

  const handleEdit = () => {
    setEditingText(true);
    setEditedText(post.text);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/question/updateQuestion/${post._id}`,
        { text: editedText },
        {
          headers: {
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );
      setPost(prevPost => ({
        ...prevPost,
        text: response.data.text
      }));
      setEditingText(false);
    } catch (error) {
      console.error('Failed to save:', error);
      setError('Failed to save');
    }
  };

  const startEdit = (answerId) => {
    setEditingAnswerId(answerId);
    const answer = post.answers.find(a => a._id === answerId);
    setEditedAnswerText(answer.text);
  };

  const cancelEdit = () => {
    setEditingAnswerId(null);
    setEditedAnswerText('');
  };

  const handleSaveAnswer = async (answerId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/answer/updateAnswer/${answerId}`,
        { text: editedAnswerText },
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
          if (answer._id === answerId) {
            return {
              ...answer,
              text: response.data.text
            };
          }
          return answer;
        })
      }));
      setEditingAnswerId(null);
    } catch (error) {
      console.error('Failed to save answer:', error);
      setError('Failed to save answer');
    }
  };

  const cancelEditPost = () => {
    setEditingText(false);
    setEditedText('');
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card mb-3">
        <div className="card-body">
          <h2 className="card-title">{post.title}</h2>
          {editingText ? (
            <textarea
              value={editedText}
              onChange={e => setEditedText(e.target.value)}
              className="form-control mb-2"
            />
          ) : (
            <p className="card-text">{post.text}</p>
          )}
          <div className="tags mt-3">
            {post.tags.map(tag => (
              <span key={tag} className="badge bg-primary me-1">{tag}</span>
            ))}
          </div>
          <div className="mt-4">
            <div>{`asked by ${post.asked_by}`}</div>
            <div>{`asked ${getMetaData(new Date(post.ask_date_time))}`}</div>
          </div>
          <div className="mt-3">
            <button className="btn btn-outline-primary btn-sm" onClick={() => handlePostVote(post._id, 'upvote')}>Upvote</button>
            <span className="mx-2">{post.upvotes}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={() => handlePostVote(post._id, 'downvote')}>Downvote</button>
          </div>
          <button className="btn btn-outline-secondary btn-sm" onClick={editingText ? handleSave : handleEdit}>
            {editingText ? 'Save' : 'Edit'}
          </button>
          {editingText && (
            <button className="btn btn-secondary btn-sm ms-2" onClick={cancelEditPost}>
              Cancel
            </button>
          )}
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
            <div className='container'>
              <div className='row'>
                <div className="col-md-3 d-flex flex-column align-items-center">
                  <button className="btn btn-outline-primary btn-sm mb-2" onClick={() => handleAnswerVote(answer._id, 'upvote')}>Upvote</button>
                  <span className="vote-count mb-2">{answer.upvotes}</span>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleAnswerVote(answer._id, 'downvote')}>Downvote</button>
                </div>
                <div className='col-md-8'>
                  {editingAnswerId === answer._id ? (
                    <div>
                      <textarea
                        value={editedAnswerText}
                        onChange={e => setEditedAnswerText(e.target.value)}
                        className="form-control mb-2"
                      />
                      <div className="row">
                        <div className="col-md-6">
                          <button className="btn btn-primary btn-sm" onClick={() => handleSaveAnswer(answer._id)}>Save</button>
                          <button className="btn btn-secondary btn-sm ms-2" onClick={cancelEdit}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="card-text">{answer.text}</p>
                      <div className="mt-4 row">
                        <div className="col-md-6">
                          <div>{`answered by ${answer.ans_by}`}</div>
                          <div>{`answered ${getMetaData(new Date(answer.ans_date_time))}`}</div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-end">
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => startEdit(answer._id)}>Edit</button>
                        </div>
                      </div>
                    </div>
                  )}
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

export default PostDetail;
