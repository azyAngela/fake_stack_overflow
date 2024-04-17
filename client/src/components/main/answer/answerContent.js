import { getMetaData } from '../../../utlis/dateFormat';

const AnswerContent = ({ answer, handleAnswerVote, editingAnswerId, editedAnswerText, setEditedAnswerText, handleSaveAnswer, startEdit, cancelEdit }) => (
    <div className="card mb-3">
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
  );

export default AnswerContent;