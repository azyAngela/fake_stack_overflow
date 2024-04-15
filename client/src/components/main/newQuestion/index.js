import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPost } from './newQuestionReducer'

function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    details: '',
    tags: '',
    username: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddPost = (newPost) => {
    dispatch(addPost(newPost));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here, for example, send data to backend
    console.log(formData);
    const newPost = {
        id: Date.now(), // You can generate a unique ID for the new post
        title: formData.title,
        overview: formData.text,
        author: formData.username,
        postDate: new Date().toISOString(),
        tags: formData.tags.split(' '), // Split the tags string into an array
        votes: 0
      };
    handleAddPost(newPost);
    setFormData({
      title: '',
      text: '',
      details: '',
      tags: '',
      username: ''
    });
    navigate('/');
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
          <label htmlFor="details" className="form-label">Add details</label>
          <textarea
            className="form-control"
            id="details"
            name="details"
            value={formData.details}
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
            required
          />
          <small className="form-text text-muted">Add keywords separated by whitespace</small>
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username*</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
