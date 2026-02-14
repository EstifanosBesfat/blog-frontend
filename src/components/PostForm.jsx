import { useState } from 'react';
import api from '../services/api';

const PostForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.post('/posts', { title, content });
      setTitle("");
      setContent("");
      onPostCreated(); // Tell parent to reload posts
      alert("Post Created!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#f8f9fa' }}>
      <h3>✍️ Write a New Post</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required 
          style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <textarea 
          placeholder="Content" value={content} onChange={e => setContent(e.target.value)} required 
          style={{ padding: '10px', fontSize: '16px', height: '100px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;