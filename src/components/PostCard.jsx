import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const parseComments = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.comments)) return data.comments;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

const PostCard = ({ post, refreshPosts, currentUser, isLoggedIn }) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  const isOwnerById = !!(post.user_id && currentUser?.id === post.user_id);
  const isOwnerByUsername = !!(
    post.username &&
    currentUser?.username &&
    post.username.toLowerCase() === currentUser.username.toLowerCase()
  );
  const canManagePost = isLoggedIn && (isOwnerById || isOwnerByUsername);
  const initialCommentCount = Number(post.comment_count || 0);
  const commentCount = commentsLoaded ? comments.length : initialCommentCount;

  const fetchComments = async () => {
    try {
      setIsCommentsLoading(true);
      const { data } = await api.get(`/posts/${post.id}/comments`);
      setComments(parseComments(data));
      setCommentsLoaded(true);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to load comments");
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const toggleComments = async () => {
    const nextOpen = !isCommentsOpen;
    setIsCommentsOpen(nextOpen);

    if (nextOpen && !commentsLoaded) {
      await fetchComments();
    }
  };

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

  const handleAddComment = async (e) => {
    e.preventDefault();
    const content = commentInput.trim();
    if (!content) return;

    try {
      setIsCommentSubmitting(true);
      const { data } = await api.post(`/posts/${post.id}/comments`, { content });
      const newComment = data.comment
        ? { ...data.comment, username: currentUser?.username || "You" }
        : null;

      if (newComment) {
        setComments((prev) => [...prev, newComment]);
        setCommentsLoaded(true);
      } else {
        await fetchComments();
      }

      setCommentInput("");
      toast.success(data.message || "Comment added");
      refreshPosts();
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to add comment");
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted");
      refreshPosts();
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to delete comment");
    }
  };

  const canDeleteComment = (comment) => {
    const ownerById = !!(comment.user_id && currentUser?.id === comment.user_id);
    const ownerByUsername = !!(
      comment.username &&
      currentUser?.username &&
      comment.username.toLowerCase() === currentUser.username.toLowerCase()
    );
    return isLoggedIn && (ownerById || ownerByUsername);
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
          gap: "10px",
        }}
      >
        <small style={{ color: "#94a3b8" }}>
          By: {post.username} | Comments: {commentCount}
        </small>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={toggleComments} className="btn-secondary" style={{ padding: "6px 12px" }}>
            {isCommentsOpen ? "Hide Comments" : "Show Comments"}
          </button>

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

      {isCommentsOpen && (
        <div
          style={{
            marginTop: "16px",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "16px",
          }}
        >
          {isCommentsLoading ? (
            <p style={{ margin: 0, color: "#64748b" }}>Loading comments...</p>
          ) : comments.length === 0 ? (
            <p style={{ margin: 0, color: "#64748b" }}>No comments yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "10px",
                    background: "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <small style={{ color: "#334155", fontWeight: 600 }}>{comment.username || "User"}</small>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <small style={{ color: "#94a3b8" }}>
                        {comment.created_at ? new Date(comment.created_at).toLocaleString() : ""}
                      </small>
                      {canDeleteComment(comment) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="btn-danger"
                          style={{ padding: "4px 8px", fontSize: "12px" }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <p style={{ margin: "8px 0 0 0", color: "#475569" }}>{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          {isLoggedIn ? (
            <form onSubmit={handleAddComment}>
              <textarea
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                rows={3}
              />
              <button type="submit" className="btn-primary" disabled={isCommentSubmitting}>
                {isCommentSubmitting ? "Posting..." : "Add Comment"}
              </button>
            </form>
          ) : (
            <p style={{ marginBottom: 0, color: "#64748b" }}>Log in to add a comment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
