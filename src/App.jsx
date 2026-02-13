import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [posts, setPosts] = useState([])
  const [token, setToken] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const API_URL = 'https://blog-api-bnxm.onrender.com/api' 

  // 1. Check if user is already logged in (on page load)
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
    }
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`)
      setPosts(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  // 2. Handle Login Submit
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email,
        password: password
      })
      
      const newToken = response.data.token
      
      // SAVE THE TOKEN
      localStorage.setItem('token', newToken)
      setToken(newToken)
      alert("Login Successful!")
      
    } catch (err) {
      alert("Login Failed: " + (err.response?.data?.error || err.message))
    }
  }

  // 3. Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>My Blog App</h1>

      {/* --- AUTH SECTION --- */}
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        {!token ? (
          <form onSubmit={handleLogin}>
            <h3>Login</h3>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ marginRight: '10px' }}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ marginRight: '10px' }}
            />
            <button type="submit">Log In</button>
          </form>
        ) : (
          <div>
            <h3 style={{ color: 'green' }}>✅ You are logged in!</h3>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </div>

      {/* --- POSTS SECTION --- */}
      <h2>Recent Posts</h2>
      <div style={{ display: 'grid', gap: '10px' }}>
        {posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{post.title}</h3>
            <p>{post.content}</p>
            <small>By: {post.username}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App