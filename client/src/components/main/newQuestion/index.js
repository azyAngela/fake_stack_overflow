import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../../utlis/userprovider";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Generate current date/time
      const currentDate = new Date().toISOString();

      const data = {
        title: formData.title,
        text: formData.text,
        tags: formData.tags.split(" ").filter((tag) => tag.trim() !== ""),
        asked_by: user.username,
        ask_date_time: currentDate
      };
      console.log(formData.tags);

      const response = await axios.post('http://localhost:8000/question/addQuestion', data, {
        headers: {
          'X-CSRF-Token': csrfToken
        },
        withCredentials: true,
      });

      console.log(response.data);
      console.log(data); // Logging the data being sent to the server
      // Clear the form fields
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
            required
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
            required
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
            required
          />
          <small className="form-text text-muted">Add keywords separated by whitespace</small>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      {error && <div className="mt-3 text-danger">{error}</div>}
    </div>
  );
};

export default CreatePost;
