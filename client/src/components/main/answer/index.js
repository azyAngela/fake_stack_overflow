import React, { useState } from 'react';

function PostDetail () {
//   const postId = match.params.id;

  // Dummy post data with votes, you can replace this with actual data fetched from the backend
  const [post, setPost] = useState({
    id: 1,
    title: 'How to use React Router',
    content: 'Learn how to implement React Router in your project.',
    author: 'John Doe',
    postDate: '2022-04-15',
    tags: ['React', 'React Router', 'Routing'],
    votes: 0,
    answers: [
      {
        id: 1,
        content: 'You can use the <Link> component to create links in React Router.',
        author: 'Jane Smith',
        answerDate: '2022-04-16',
        votes: 0
      },
      {
        id: 1,
        content: 'You can use the <Link> component to create links in React Router.',
        author: 'Jane Smith',
        answerDate: '2022-04-16',
        votes: 0
      },
      // Add more answers as needed
    ]
  });

  const handlePostVote = (voteType) => {
    setPost(prevPost => ({
      ...prevPost,
      votes: voteType === 'upvote' ? prevPost.votes + 1 : prevPost.votes - 1
    }));
  };

  const handleAnswerVote = (answerId, voteType) => {
    setPost(prevPost => ({
      ...prevPost,
      answers: prevPost.answers.map(answer => {
        if (answer.id === answerId) {
          return {
            ...answer,
            votes: voteType === 'upvote' ? answer.votes + 1 : answer.votes - 1
          };
        }
        return answer;
      })
    }));
  };

  return (
    <div className="container mt-5">
      <div className="card mb-3">
        <div className="card-body">
          <h2 className="card-title">{post.title}</h2>
          <p className="card-text">{post.content}</p>
          <div className="tags mt-3">
            {post.tags.map(tag => (
              <span key={tag} className="badge bg-primary me-1">{tag}</span>
            ))}
          </div>
          <div className="mt-4">
            <div>{`Author: ${post.author}`}</div>
            <div>{`Posted on: ${post.postDate}`}</div>
          </div>
          <div className="mt-3">
            <button className="btn btn-outline-primary btn-sm" onClick={() => handlePostVote('upvote')}>Upvote</button>
            <span className="mx-2">{post.votes}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={() => handlePostVote('downvote')}>Downvote</button>
          </div>
        </div>
      </div>
      <h3>Answers</h3>
      {post.answers.map(answer => (
        <div key={answer.id} className="card mb-3">
          <div className="card-body">
            <p className="card-text">{answer.content}</p>
            <div className="mt-4">
              <div>{`Author: ${answer.author}`}</div>
              <div>{`Posted on: ${answer.answerDate}`}</div>
            </div>
            <div className="mt-3">
              <button className="btn btn-outline-primary btn-sm" onClick={() => handleAnswerVote(answer.id, 'upvote')}>Upvote</button>
              <span className="mx-2">{answer.votes}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleAnswerVote(answer.id, 'downvote')}>Downvote</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostDetail;

// import React from 'react';

// const Answer = () => {
//   // Assuming the post ID is passed as a parameter in the URL
// //   const postId = match.params.id;

//   // Dummy post data, you can replace this with actual data fetched from the backend
//   const post = {
//     id: 1,
//     title: 'How to use React Router',
//     content: 'Learn how to implement React Router in your project.',
//     author: 'John Doe',
//     postDate: '2022-04-15',
//     tags: ['React', 'React Router', 'Routing'],
//     answers: [
//       {
//         id: 1,
//         content: 'You can use the <Link> component to create links in React Router.',
//         author: 'Jane Smith',
//         answerDate: '2022-04-16',
//       },
//       {
//         id: 2,
//         content: 'You can use the <Link> component to create links in React Router.',
//         author: 'Jane Smith',
//         answerDate: '2022-04-16',
//       },
//       // Add more answers as needed
//     ]
//   };

//   return (
//     <div className="container mt-5">
//       <div className="card mb-3">
//         <div className="card-body">
//           <h2 className="card-title">{post.title}</h2>
//           <p className="card-text">{post.content}</p>
//           <div className="tags mt-3">
//             {post.tags.map(tag => (
//               <span key={tag} className="badge bg-primary me-1">{tag}</span>
//             ))}
//           </div>
//           <div className="mt-4">
//             <div>{`Author: ${post.author}`}</div>
//             <div>{`Posted on: ${post.postDate}`}</div>
//           </div>
//         </div>
//       </div>
//       <h3>Answers</h3>
//       {post.answers.map(answer => (
//         <div key={answer.id} className="card mb-3">
//           <div className="card-body">
//             <p className="card-text">{answer.content}</p>
//             <div className="mt-4">
//               <div>{`Author: ${answer.author}`}</div>
//               <div>{`Posted on: ${answer.answerDate}`}</div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Answer;

