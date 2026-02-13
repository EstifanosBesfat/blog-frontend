import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [posts, setPosts] = useState([])
  const [token, setToken] = useState(null)
  
  // Login State
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Create Post State
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  // REPLACE WITH YOUR RENDER URL
  const API_URL = 'https://blog-api-bnxm.onrender.com/api' 

  // 1. Load Data & Token on Startup
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) setToken(savedToken)
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`)
      setPosts(response.data)
    } catch (err) {
      console.error("Error fetching posts:", err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      const newToken = response.data.token
      localStorage.setItem('token', newToken)
      setToken(newToken)
      alert("Login Successful!")
    } catch (err) {
      alert("Login Failed")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  // --- NEW: CREATE POST FUNCTION ---
  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!token) return alert("You must be logged in!")

    try {
      // 1. Send Request with Header
      await axios.post(
        `${API_URL}/posts`, 
        { title, content }, 
        { headers: { Authorization: `Bearer ${token}` } } // <--- THE KEY
      )

      // 2. Clear Form
      setTitle("")
      setContent("")
      
      // 3. Refresh List
      fetchPosts()
      alert("Post Created!")
    } catch (err) {
      console.error(err)
      const errorMessage = err.response?.data?.error || "Failed to create post";
      alert(errorMessage);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>My Full Stack Blog</h1>

      {/* --- AUTH SECTION --- */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
        {!token ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px' }}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Log In</button>
          </form>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: 'green' }}>✅ Logged In</h3>
            <button onClick={handleLogout} style={{ background: '#ff4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Log Out</button>
          </div>
        )}
      </div>

      {/* --- NEW: CREATE POST FORM (Only if logged in) --- */}
      {token && (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>✍️ Write a New Post</h3>
          <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
              style={{ padding: '8px', fontSize: '16px' }}
            />
            <textarea 
              placeholder="Content" 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              required 
              style={{ padding: '8px', fontSize: '16px', height: '100px' }}
            />
            <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Publish Post
            </button>
          </form>
        </div>
      )}

      {/* --- POST LIST --- */}
      <h2>Recent Posts</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        {posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px', position: 'relative' }}>
            
            {/* STATUS BADGE */}
            <span style={{ 
              position: 'absolute', top: '10px', right: '10px', 
              background: post.status === 'published' ? '#d4edda' : '#fff3cd',
              color: post.status === 'published' ? '#155724' : '#856404',
              padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
            }}>
              {post.status || 'draft'}
            </span>

            <h3 style={{ marginTop: 0 }}>{post.title}</h3>
            <p style={{ color: '#555' }}>{post.content}</p>
            <small style={{ color: '#888' }}>By: {post.username}</small>

            {/* PUBLISH BUTTON (Only if Draft + Logged In) */}
            {token && post.status !== 'published' && (
              <button 
                onClick={async () => {
                  try {
                    await axios.put(
                      `${API_URL}/posts/${post.id}/publish`, 
                      {}, 
                      { headers: { Authorization: `Bearer ${token}` } }
                    )
                    alert("Post Published!")
                    fetchPosts() // Refresh list to see change
                  } catch (err) {
                    alert("Failed to publish (Are you the owner?)")
                  }
                }}
                style={{ display: 'block', marginTop: '10px', background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
              >
                🚀 Publish Now
              </button>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}

export default App