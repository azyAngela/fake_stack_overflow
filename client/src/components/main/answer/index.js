import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostContent from './postContent';
import AnswerContent from './answerContent';
import { getCsrfToken } from '../services/profile';
import { downvoteQuestion, fetchQuestion, updateQuestion, upvoteQuestion, deleteQuestion } from '../services/question';
import { updateAnswer, upvoteAnswer, downvoteAnswer, deleteAnswer } from '../services/answer';
import checkLoginStatus from '../services/checkLoginStatus'; // Import the checkLoginStatus function
import { useNavigate } from 'react-router-dom';


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
  const [loggedIn, setLoggedIn] = useState(false); // State to track login status

  const qid = useParams().id;
  const navigate = useNavigate();

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

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedInStatus = await checkLoginStatus(); // Call the checkLoginStatus function
      setLoggedIn(loggedInStatus); // Update the login status state
    };

    checkLoggedIn();
  }, []);

  const handlePostVote = async (qid, voteType) => {
    try {
      if (!loggedIn) {
        console.log("loggedIn", loggedIn);
        setError('Please sign in first'); // Set an error message if not logged in
        return;
      }
      const prevCount = votedPosts[qid] || 0;

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
      let newNumber = 0;
      if (voteType === 'upvote') {
        const response = await upvoteQuestion(qid, increment, csrfToken);
        newNumber = response.data.upvotes;
      } else if (voteType === 'downvote') {
        const response = await downvoteQuestion(qid, increment, csrfToken);
        newNumber = response.data.upvotes;
      }

      setPost(prevPost => ({
        ...prevPost,
        upvotes: newNumber
      }));

      setVotedPosts(prevVotedPosts => ({
        ...prevVotedPosts,
        [qid]: prevCount + increment
      }));
    } catch (error) {
      setError('Failed to vote');
    }
  };


  const handleAnswerVote = async (aid, voteType) => {
    try {
      if (!loggedIn) {
        console.log("loggedIn", loggedIn);
        setError('Please sign in first'); // Set an error message if not logged in
        return;
      }
      const prevCount = votedAnswers[aid] || 0;

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
      if (voteType === 'upvote') {
        await upvoteAnswer(aid, increment, csrfToken);
      } else if (voteType === 'downvote') {
        await downvoteAnswer(aid, increment, csrfToken);
      }

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
        [aid]: prevCount + increment
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

  const handleDelete = async (postId) => {
    try {
      // console.log("postId", postId);
      // console.log("post", post);
      await deleteQuestion(postId, csrfToken);
      navigate('/');
  
    } catch (error) {
      console.error('Failed to delete question:', error);
      setError('Failed to delete question. Please try again later.');
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      await deleteAnswer(answerId, csrfToken);
      setPost(prevPost => ({
        ...prevPost,
        answers: prevPost.answers.filter(answer => answer._id !== answerId)
      }));
    } catch (error) {
      console.error('Failed to delete answer:', error);
      setError('Failed to delete answer. Please try again later.');
    }
  }
  
  

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
        loggedIn={loggedIn}
        handleDelete={handleDelete}
      />
      <div className="row">
        <div className="col-md-6">
          <h3>Answers</h3>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          {loggedIn && (
            <Link to={`/newAnswer/${qid}`} className="btn btn-primary mb-3">Create an Answer</Link>
          )}
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
          loggedIn={loggedIn}
          handleDeleteAnswer={handleDeleteAnswer}
        />
      ))}
      {error && <div className="mt-3 text-danger">{error}</div>}
    </div>
  );
};

export default PostDetail;
