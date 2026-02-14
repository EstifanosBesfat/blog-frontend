import { useState, useEffect } from 'react';
import api from '../services/api'; // Use the new service
import PostCard from '../components/PostCard';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { data } = await api.get('/posts'); // Look how clean this is!
        setPosts(data);
      } catch (err) {
        alert("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/posts/${id}`);
      // Optimistic UI Update: Remove it from screen immediately
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete. You might not be the owner.");
    }
  };

  if (loading) return <h2>Loading your feed...</h2>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Latest Posts</h1>
      {posts.map(post => (
        <PostCard key={post.id} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default FeedPage;