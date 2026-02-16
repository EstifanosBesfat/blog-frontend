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
      {isLoggedIn && <PostForm onPostCreated={fetchPosts} />}
      
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
    </div>
  );
};

export default FeedPage;
