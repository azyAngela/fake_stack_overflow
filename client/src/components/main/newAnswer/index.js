import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams} from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import { useUser } from "../../../utlis/userprovider";

function NewAnswer() {
  const [answerText, setAnswerText] = useState('');
  const { qid } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

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

  const handleCreateAnswer = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/answer/addAnswer`,
        {
            qid: qid,
            ans: {
              text: answerText,
              ans_by: user.username,
            }
          }, 
          {
            headers: {
              'X-CSRF-Token': csrfToken
            },
            withCredentials: true,
          }

      );
      console.log(response.data);
      // Redirect to the post detail page after successfully creating the answer
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
