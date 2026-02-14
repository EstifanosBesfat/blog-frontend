import { useState, useEffect } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm'; // Import the form!

const FeedPage = ({ isLoggedIn }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div className="container" style={{textAlign: 'center'}}><h2>⏳ Waking up the server...</h2></div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1>Community Feed</h1>
        <p style={{ color: '#64748b' }}>Check out what developers are building.</p>
      </div>

      {/* Show Create Form ONLY if logged in */}
      {isLoggedIn && <PostForm onPostCreated={fetchPosts} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {posts.map(post => (
          <div key={post.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="status-badge" style={{ 
                background: post.status === 'published' ? '#dcfce7' : '#fef9c3',
                color: post.status === 'published' ? '#166534' : '#854d0e'
              }}>
                {post.status || 'draft'}
              </span>
              <small style={{ color: '#94a3b8' }}>{new Date(post.created_at).toLocaleDateString()}</small>
            </div>

            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>{post.title}</h3>
            <p style={{ lineHeight: '1.6', color: '#475569' }}>{post.content}</p>

            <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', color: '#475569' }}>👤 {post.username}</span>
              {/* Note: You can re-add the Delete button logic here if you pass it as a prop or handle it in this component */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;