import api from "../services/api";
import toast from "react-hot-toast";

const PostCard = ({ post, refreshPosts, currentUser, isLoggedIn }) => {
  const isOwnerById = !!(post.user_id && currentUser?.id === post.user_id);
  const isOwnerByUsername = !!(
    post.username &&
    currentUser?.username &&
    post.username.toLowerCase() === currentUser.username.toLowerCase()
  );
  const canManagePost = isLoggedIn && (isOwnerById || isOwnerByUsername);
  const commentCount = Number(post.comment_count || 0);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${post.id}`);
      toast.success("Post deleted");
      refreshPosts();
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to delete post");
    }
  };

  const handlePublish = async () => {
    try {
      await api.put(`/posts/${post.id}/publish`);
      toast.success("Post published");
      refreshPosts();
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to publish post");
    }
  };

  return (
    <div className="card" style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <span
          className="status-badge"
          style={{
            background: post.status === "published" ? "#dcfce7" : "#fef9c3",
            color: post.status === "published" ? "#166534" : "#854d0e",
          }}
        >
          {post.status || "draft"}
        </span>
      </div>

      <h3 style={{ margin: "0 0 10px 0" }}>{post.title}</h3>
      <p style={{ color: "#475569", lineHeight: "1.6" }}>{post.content}</p>

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <small style={{ color: "#94a3b8" }}>
          By: {post.username} | Comments: {commentCount}
        </small>

        {canManagePost && (
          <div style={{ display: "flex", gap: "10px" }}>
            {post.status !== "published" && (
              <button
                onClick={handlePublish}
                style={{
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                Publish
              </button>
            )}
            <button onClick={handleDelete} className="btn-danger">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
