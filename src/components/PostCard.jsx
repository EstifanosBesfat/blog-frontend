import api from '../services/api';

const PostCard = ({ post, refreshPosts, isLoggedIn }) => {
  
  // LOGIC: Delete Post
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await api.delete(`/posts/${post.id}`);
      alert('Post deleted');
      refreshPosts(); // Reload list
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete post');
    }
  };

  // LOGIC: Publish Post
  const handlePublish = async () => {
    try {
      // Assuming your backend has a PUT route for this, or we use update
      // If you don't have a specific /publish route, we can just update the status
      await api.put(`/posts/${post.id}`, { status: 'published' });
      alert("Post Published!");
      refreshPosts();
    } catch (err) {
      alert("Failed to publish (Are you the owner?)");
    }
  };

  // STYLES
  const cardStyle = {
    border: '1px solid #eee', padding: '20px', borderRadius: '8px', 
    position: 'relative', marginBottom: '15px', background: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  };

  const badgeStyle = {
    position: 'absolute', top: '10px', right: '10px',
    background: post.status === 'published' ? '#d4edda' : '#fff3cd',
    color: post.status === 'published' ? '#155724' : '#856404',
    padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
  };

  return (
    <div style={cardStyle}>
      {/* STATUS BADGE */}
      <span style={badgeStyle}>{post.status || 'draft'}</span>

      <h3 style={{ marginTop: 0 }}>{post.title}</h3>
      <p style={{ color: '#555', lineHeight: '1.6' }}>{post.content}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        <small style={{ color: '#888' }}>By: {post.username}</small>
        <small style={{ color: '#888' }}>{post.comment_count || 0} 💬 comments</small>
      </div>

      {/* ACTIONS (Only if logged in) */}
      {isLoggedIn && (
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          
          {/* PUBLISH BUTTON (Only show if draft) */}
          {post.status !== 'published' && (
            <button 
              onClick={handlePublish}
              style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              🚀 Publish
            </button>
          )}

          <button
            onClick={handleDelete}
            style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;