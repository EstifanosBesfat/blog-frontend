import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      onLogin(data.token); // Update App state
      navigate('/'); // Go to Feed
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome Back</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" placeholder="Email" value={email} required 
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" value={password} required 
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-primary">Log In</button>
        </form>

        {/* RECRUITER TIP: Add Demo Credentials */}
        <div style={{ marginTop: '20px', padding: '10px', background: '#f0f9ff', borderRadius: '8px', fontSize: '14px' }}>
          <strong>👀 Recruiter/Demo Mode:</strong><br/>
          Email: <code>cloud@test.com</code><br/>
          Pass: <code>secure123</code>
        </div>

        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Need an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;