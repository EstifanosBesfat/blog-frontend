import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h2 style={{ margin: 0, color: '#2563eb' }}>🚀 DevBlog</h2>
      </div>
      <div>
        <Link to="/">Feed</Link>
        {isLoggedIn ? (
          <>
            <span style={{ margin: '0 15px', color: '#cbd5e1' }}>|</span>
            <button onClick={handleLogoutClick} className="btn-secondary">Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log In</Link>
            <Link to="/register" style={{ 
              background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '6px', marginLeft: '15px' 
            }}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;