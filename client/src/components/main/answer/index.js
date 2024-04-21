import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import PostContent from './postContent';
import AnswerContent from './answerContent';
import { getCsrfToken } from '../services/profile';
import { fetchQuestion, updateQuestion } from '../services/question';
import { updateAnswer } from '../services/answer';

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
      const response = await getCsrfToken();
      setCsrfToken(response);
      console.log(response);
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
      const prevVote = votedPosts[qid];
      let increment;
  
      if (prevVote === voteType) {
        increment = voteType === 'upvote' ? -1 : 1;
        voteType = 'cancel'; 
      } else if (prevVote === 'upvote' && voteType === 'downvote') {
        increment = -2;
      } else if (prevVote === 'downvote' && voteType === 'upvote') {
        increment = 2;
      } else {
        increment = voteType === 'upvote' ? 1 : -1;
      }
  
      const endpoint = voteType === 'upvote' ? `/upvoteQuestion/${qid}` : `/downvoteQuestion/${qid}`;
  
      await axios.put(`http://localhost:8000/question/${endpoint}`, null, {
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      setPost(prevPost => ({
        ...prevPost,
        upvotes: prevPost.upvotes + increment
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
      const prevVote = votedAnswers[aid];
      let increment;
  
      if (prevVote === voteType) {
        increment = voteType === 'upvote' ? -1 : 1;
        voteType = 'cancel'; 
      } else if (prevVote === 'upvote' && voteType === 'downvote') {
        increment = -2;
      } else if (prevVote === 'downvote' && voteType === 'upvote') {
        increment = 2;
      } else {
        increment = voteType === 'upvote' ? 1 : -1;
      }
  
      const endpoint = voteType === 'upvote' ? `upvoteAnswer/${aid}` : `downvoteAnswer/${aid}`;
  
      await axios.post(`http://localhost:8000/answer/${endpoint}`, null, {
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });
  
      setPost(prevPost => ({
        ...prevPost,
        answers: prevPost.answers.map(answer => {
          if (answer._id === aid) {
            return {
              ...answer,
              upvotes: answer.upvotes + increment
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
    const edited = { text: editedText }
    try {
      const response = await updateQuestion(qid, edited, csrfToken);
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
    const edited = { text: editedAnswerText }
    try {
      const response = await updateAnswer(answerId, edited, csrfToken);
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
      <PostContent
        post={post}
        handleVote={handlePostVote}
        editingText={editingText}
        editedText={editedText}
        setEditedText={setEditedText}
        handleSave={handleSave}
        handleEdit={handleEdit}
        cancelEditPost={cancelEditPost}
      />
      <div className="row">
        <div className="col-md-6">
          <h3>Answers</h3>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <Link to={`/newAnswer/${qid}`} className="btn btn-primary mb-3">Create an Answer</Link>
        </div>
      </div>
      {post.answers.map(answer => (
        <AnswerContent
          key={answer._id}
          answer={answer}
          handleAnswerVote={handleAnswerVote}
          editingAnswerId={editingAnswerId}
          editedAnswerText={editedAnswerText}
          setEditedAnswerText={setEditedAnswerText}
          handleSaveAnswer={handleSaveAnswer}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
        />
      ))}
      {error && <div className="mt-3 text-danger">{error}</div>}
    </div>
  );
};

export default PostDetail;
