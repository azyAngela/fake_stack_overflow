import { getMetaData } from '../../../utlis/dateFormat';
import { useUser } from '../../../utlis/userprovider';
import { useState } from 'react';


const AnswerContent = ({ answer, handleAnswerVote, editingAnswerId, editedAnswerText, setEditedAnswerText, handleSaveAnswer, startEdit, cancelEdit, loggedIn }) => {

  const { user } = useUser(); 
  const isOwner = user && answer.ans_by === user.username;
  const [errorMessage, setErrorMessage] = useState('');

  const handleClick = (answerId, voteType) => {
    if (loggedIn) {
      handleAnswerVote(answerId, voteType);
    } else {
      setErrorMessage('Please sign in to vote.');
    }
  };

  const handleEditClick = (answerId) => {
    if (isOwner) {
      startEdit(answerId);
    } 
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className='container'>
          <div className='row'>
            <div className="col-md-3 d-flex flex-column align-items-center">
              <button className="btn btn-outline-primary btn-sm mb-2" onClick={() => handleClick(answer._id, 'upvote')}>Upvote</button>
              <span className="vote-count mb-2">{answer.upvotes}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleClick(answer._id, 'downvote')}>Downvote</button>
            </div>
            <div className='col-md-8'>
              {editingAnswerId === answer._id ? (
                <div>
                  <textarea
                    value={editedAnswerText}
                    id='edit-textareaAnswer'
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
                      <div id='username'>{`answered by ${answer.ans_by}`}</div>
                      <div>{`answered ${getMetaData(new Date(answer.ans_date_time))}`}</div>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                      {isOwner && (
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEditClick(answer._id)}>Edit Answer</button>
                        )}
                      
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default AnswerContent;
