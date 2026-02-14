import { useState, useEffect } from 'react';
import api from './services/api';
import PostCard from './components/PostCard';
import PostForm from './components/PostForm';

function App() {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // NEW: Loading state to track the "Cold Start"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true); // Start loading
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false); // Stop loading (success or fail)
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      alert("Login Successful!");
    } catch (err) {
      alert("Login Failed: " + (err.response?.data?.error || "Check credentials"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    alert("Logged out");
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <h1>🚀 My Blog</h1>
        
        {!token ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px' }}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Log In</button>
          </form>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Logged In</span>
            <button onClick={handleLogout} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Log Out</button>
          </div>
        )}
      </div>

      {/* --- COLD START WARNING (Only shows while loading) --- */}
      {loading && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          color: '#856404', 
          padding: '15px', 
          borderRadius: '8px', 
          border: '1px solid #ffeeba',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <strong>⏳ Waking up the server...</strong> <br/>
          Since I am using the free tier of Render, this might take 30-60 seconds. <br/>
          Please wait while the database spins up!
        </div>
      )}

      {/* CREATE POST FORM */}
      {token && <PostForm onPostCreated={fetchPosts} />}

      {/* POST LIST */}
      <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', display: 'inline-block' }}>Recent Posts</h2>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {!loading && posts.length === 0 && <p>No posts yet.</p>}
        
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            refreshPosts={fetchPosts} 
            isLoggedIn={!!token} 
          />
        ))}
      </div>
    </div>
  );
}

export default App;