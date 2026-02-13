import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://blog-api-bnxm.onrender.com/api/posts",
        );
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("error fetching posts:", err);
        setError("Failed to load posts. Is the backend awake?");
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1 style={{ color: "red" }}>{error}</h1>;
  return (
    <div style={{ padding: "20px" }}>
      <h1>My Blog Posts ({posts.length})</h1>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <small>By: {post.username}</small>
        </div>
      ))}
    </div>
  );
}

export default App