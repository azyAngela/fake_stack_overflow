import { getMetaData } from '../../../utlis/dateFormat';

const PostContent = ({ post, handleVote, editingText, editedText, setEditedText, handleSave, handleEdit, cancelEditPost }) => (
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
          <button className="btn btn-outline-primary btn-sm" onClick={() => handleVote(post._id, 'upvote')}>Upvote</button>
          <span className="mx-2">{post.upvotes}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={() => handleVote(post._id, 'downvote')}>Downvote</button>
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
  );

export default PostContent;