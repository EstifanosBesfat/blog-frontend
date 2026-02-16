const TOKEN_KEY = "token";
const USER_KEY = "user";

const decodeTokenPayload = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const saveAuthSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const getCurrentUser = () => {
  const token = getAuthToken();
  if (!token) return null;

  const tokenPayload = decodeTokenPayload(token);
  if (!tokenPayload) return null;

  const storedUserRaw = localStorage.getItem(USER_KEY);
  const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

  return {
    ...tokenPayload,
    ...(storedUser || {}),
  };
};
