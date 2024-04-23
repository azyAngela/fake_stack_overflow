import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../../utlis/userprovider";
import { getCsrfToken } from '../services/profile';
import { addQuestion } from '../services/question';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    tags: ''
  });

  const { user } = useUser();

  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title) {
        setError('Question title is required');
        return;
      } else if (formData.title.length > 50) {
        setError('Question title cannot be longer than 50 characters');
        return;
      }

      if (!formData.text) {
        setError('Question text is required');
        return;
      } else if (formData.text.length < 10) {
        setError('Question text must be at least 10 characters long');
        return;
      }

      if (!formData.tags) {
        setError('Tags should not be empty');
        return;
      }
      // Generate current date/time
      const currentDate = new Date().toISOString();

      const data = {
        title: formData.title,
        text: formData.text,
        tags: formData.tags.split(" ").filter((tag) => tag.trim() !== ""),
        asked_by: user? user.username:'',
        ask_date_time: currentDate
      };

      await addQuestion(data, csrfToken);

      setFormData({
        title: '',
        text: '',
        tags: ''
      });
      navigate('/');
    } catch (error) {
      setError('Failed to add question');
      console.error('Failed to add question:', error);
    }
  };


  return (
    <div className="container mt-5">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Question Title*</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={100}
          />
          <small className="form-text text-muted">Limit title to 100 characters or less</small>
        </div>
        <div className="mb-3">
          <label htmlFor="text" className="form-label">Question Text*</label>
          <textarea
            className="form-control"
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">Tags*</label>
          <input
            type="text"
            className="form-control"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
          <small className="form-text text-muted">Add keywords separated by whitespace</small>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      {error && <div className="text-danger mt-3">{error}</div>}
    </div>
  );
};

export default CreatePost;
