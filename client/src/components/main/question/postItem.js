import { getMetaData } from '../../../utlis/dateFormat';
import { Link } from 'react-router-dom';

const PostItem = ({ post, handleVote }) => (
    <div key={post._id} className="card mb-3">
      <div className="card-body">
        <div className="row">
          <div className="col-md-3 d-flex flex-column align-items-center">
            <button className="btn btn-outline-primary btn-sm mb-2" onClick={() => handleVote(post._id, 'upvote')}>Upvote</button>
            <div className="vote-count mb-2">{post.upvotes}</div>
            <button className="btn btn-outline-danger btn-sm" onClick={() => handleVote(post._id, 'downvote')}>Downvote</button>
          </div>
          <div className="col-md-6">
            <Link to={`/posts/${post._id}`} className="text-decoration-none text-dark">
              <h3 className="card-title">{post.title}</h3>
            </Link>
            <p className="card-text">{post.text}</p>
            <div className="tags mt-3">
              {post.tags.map(tag => (
                <span key={tag} className="badge bg-primary me-1">{tag}</span>
              ))}
            </div>
          </div>
          <div className="col-md-3">
            <div>
              <div>{`asked by: ${post.asked_by}`}</div>
              <div>{`asked ${getMetaData(new Date(post.ask_date_time))}`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

export default PostItem;