import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const categories = ['All', 'Doubts', 'Events', 'Resources', 'Assignments'];

const Forum = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('All');
  const [text, setText] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [postCategory, setPostCategory] = useState('Doubts');
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState({});

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/posts', {
        params: category !== 'All' ? { category } : {},
      });
      setPosts(res.data);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [category]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!text) return;
    try {
      await axios.post('/api/posts', {
        text,
        hashtags: hashtags.split(',').map(h => h.trim()).filter(Boolean),
        category: postCategory,
      });
      setText('');
      setHashtags('');
      setPostCategory('Doubts');
      fetchPosts();
    } catch (err) {
      // handle error
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`/api/posts/${postId}/like`);
      fetchPosts();
    } catch (err) {}
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]) return;
    try {
      await axios.post(`/api/posts/${postId}/comment`, { text: commentText[postId] });
      setCommentText({ ...commentText, [postId]: '' });
      fetchPosts();
    } catch (err) {}
  };

  return (
    <div className="forum-container">
      <h2>Forum</h2>
      <form onSubmit={handlePost} className="post-form">
        <textarea placeholder="What's on your mind?" value={text} onChange={e => setText(e.target.value)} required />
        <input placeholder="Hashtags (comma separated)" value={hashtags} onChange={e => setHashtags(e.target.value)} />
        <select value={postCategory} onChange={e => setPostCategory(e.target.value)}>
          {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit">Post</button>
      </form>
      <div className="category-filter">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={category === c ? 'active' : ''}>{c}</button>
        ))}
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="posts-list">
          {posts.map(post => (
            <div key={post._id} className="post">
              <div className="post-header">
                <span>{post.author?.name}</span> <span className="post-category">[{post.category}]</span>
              </div>
              <div className="post-text">{post.text}</div>
              <div className="post-hashtags">{post.hashtags?.map(h => <span key={h}>#{h} </span>)}</div>
              <div className="post-actions">
                <button onClick={() => handleLike(post._id)}>
                  Like ({post.likes?.length || 0})
                </button>
              </div>
              <div className="comments-section">
                <div className="comments-list">
                  {post.comments?.map(comment => (
                    <div key={comment._id} className="comment">
                      <b>{comment.author?.name}:</b> {comment.text}
                    </div>
                  ))}
                </div>
                <form onSubmit={e => { e.preventDefault(); handleComment(post._id); }} className="comment-form">
                  <input
                    placeholder="Add a comment..."
                    value={commentText[post._id] || ''}
                    onChange={e => setCommentText({ ...commentText, [post._id]: e.target.value })}
                  />
                  <button type="submit">Comment</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forum; 