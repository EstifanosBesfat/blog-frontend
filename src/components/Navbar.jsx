import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { updateStoredUser } from "../services/auth";

const getInitials = (name = "") => {
  const trimmed = name.trim();
  if (!trimmed) return "U";
  const parts = trimmed.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const Navbar = ({ isLoggedIn, onLogout, currentUser, onUserUpdated }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const username = currentUser?.username || "User";
  const initials = useMemo(() => getInitials(username), [username]);
  const avatarUrl = previewUrl || currentUser?.profile_picture || "";

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Choose an image first");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      const { data } = await api.post("/users/upload-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = updateStoredUser(data.user || {});
      onUserUpdated?.(updatedUser);
      toast.success(data.message || "Profile picture updated");
      setSelectedFile(null);
      setPreviewUrl("");
      setIsProfilePanelOpen(false);
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to upload profile picture",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <nav>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <h2 style={{ margin: 0, color: "#2563eb" }}>DevBlog</h2>
      </div>
      <div className="nav-right">
        <Link to="/">Feed</Link>
        {isLoggedIn ? (
          <>
            <button
              type="button"
              className="avatar-button"
              onClick={() => setIsProfilePanelOpen((prev) => !prev)}
              title="Update profile picture"
            >
              <span className="avatar-ring">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={username} className="avatar-image" />
                ) : (
                  <span className="avatar-fallback">{initials}</span>
                )}
              </span>
            </button>

            <button onClick={handleLogoutClick} className="btn-secondary">
              Log Out
            </button>

            {isProfilePanelOpen && (
              <div className="profile-panel card">
                <h4 style={{ margin: "0 0 8px 0" }}>{username}</h4>
                <p style={{ margin: "0 0 14px 0", color: "#64748b", fontSize: "14px" }}>
                  Upload a new profile picture (jpg/png, up to 2MB).
                </p>

                <div className="profile-preview">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile preview" className="avatar-image" />
                  ) : (
                    <span className="avatar-fallback">{initials}</span>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
                <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ flex: 1 }}
                    disabled={isUploading}
                    onClick={handleUpload}
                  >
                    {isUploading ? "Uploading..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <Link to="/login">Log In</Link>
            <Link
              to="/register"
              style={{
                background: "#2563eb",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                marginLeft: "15px",
              }}
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
