import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { getCurrentUser } from '../services/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';

const FeedPage = ({ isLoggedIn }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentUser = getCurrentUser();

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/posts');
      const parsedPosts = Array.isArray(data)
        ? data
        : data.posts || data.data || [];
      setPosts(parsedPosts);
    } catch (err) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <div className="container"><h2>Loading...</h2></div>;

  return (
    <div className="container">
      <h1>Community Feed</h1>
      <p style={{ color: "#64748b", marginTop: "-6px" }}>
        Read published work, share feedback, and join the discussion.
      </p>
      {isLoggedIn && <PostForm onPostCreated={fetchPosts} />}
      
      {posts.length === 0 ? (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>No posts yet</h3>
          <p style={{ marginBottom: 0, color: "#64748b" }}>
            Be the first to publish something to the feed.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              refreshPosts={fetchPosts} 
              currentUser={currentUser}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedPage;
