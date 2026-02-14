# 🎨 React Blog Frontend (Full Stack Capstone)

A modern, responsive blogging interface built with **React (Vite)**. This project serves as the frontend client for a custom **Node.js/PostgreSQL Backend**.

It features a polished **Glassmorphism UI**, robust authentication handling, and optimized UX for serverless backends (handling cold starts gracefully).

---

## 🔗 Live Demo & Backend

| Service | Status | Link |
| :--- | :--- | :--- |
| **Live Frontend** | 🟢 Online | [**Visit the Blog (Vercel)**](https://blog-frontend-nine-woad.vercel.app) |
| **Backend API** | ⚙️ Repo | [View Backend Code](https://github.com/estifanosbesfat/blog-api) |
| **API Docs** | 📜 Swagger | [View API Documentation](https://blog-api-bnxm.onrender.com/api-docs) |

> **👀 Recruiter Demo Credentials:**
> *   **Email:** `cloud@test.com`
> *   **Password:** `secure123`

---

## 🛠️ Tech Stack

*   **Framework:** React 18 (Vite)
*   **Styling:** Custom CSS (Glassmorphism Design System)
*   **State Management:** React Hooks (`useState`, `useEffect`, `Context`)
*   **Routing:** React Router DOM v6
*   **HTTP Client:** Axios (with Interceptors)
*   **Deployment:** Vercel

---

## ✨ Key Features

*   **🔐 Secure Authentication:**
    *   Full Login/Register flows.
    *   JWT storage in `localStorage`.
    *   **Axios Interceptors** automatically attach `Authorization: Bearer <token>` headers to outgoing requests.
*   **🎨 Modern UI/UX:**
    *   **Glassmorphism Design:** Translucent cards, soft shadows, and modern typography.
    *   **Responsive:** Fully mobile-optimized Navbar and Grid layout.
    *   **Cold Start Handling:** Custom UI banners detect when the free-tier backend is "waking up" to keep users informed.
*   **⚡ Dynamic Data:**
    *   Fetches real-time data from a PostgreSQL database.
    *   Optimistic UI updates for Deleting/Creating posts.
    *   Visual status badges (Draft vs Published).

---

## 📂 Project Structure

```text
src/
 ├── components/     # Reusable UI parts (Navbar, PostCard, Forms)
 ├── pages/          # Full screen views (Feed, Login, Register)
 ├── services/       # API configuration & Axios setup
 ├── App.jsx         # Main Router & Layout logic
 ├── index.css       # Global Glassmorphism styles
 └── main.jsx        # Entry point