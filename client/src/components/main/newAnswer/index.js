import React, { useState } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { useUser } from "../../../utlis/userprovider";
import { getCsrfToken } from '../services/profile.js';
import { addAnswer } from '../services/answer.js';
function NewAnswer() {
  const [answerText, setAnswerText] = useState('');
  const { qid } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [error, setError] = useState('');

  const [csrfToken, setCsrfToken] = useState('');

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

  const handleCreateAnswer = async () => {
    const newanswer = { qid: qid,
      ans: {
        text: answerText,
        ans_by: user.username,
      }}
    try {
      await addAnswer(newanswer, csrfToken);
      navigate(`/posts/${qid}`);
    } catch (error) {
      console.error('Failed to create answer:', error);
        setError('Failed to create answer');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create a New Answer</h2>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows="5"
          placeholder="Enter your comments here"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
        ></textarea>
      </div>
      <button className="btn btn-primary" onClick={handleCreateAnswer}>Create Answer</button>
        {error && <div className="text-danger mt-3">{error}</div>}
    </div>
  );
}

export default NewAnswer;
