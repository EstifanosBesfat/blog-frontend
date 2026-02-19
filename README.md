# React Blog Frontend

A responsive React (Vite) frontend for the Blog API backend.

## Live Links

- Frontend: https://blog-frontend-nine-woad.vercel.app
- Backend API: https://blog-api-bnxm.onrender.com
- API Docs: https://blog-api-bnxm.onrender.com/api-docs

Recruiter demo credentials:
- Email: `cloud@test.com`
- Password: `secure123`

## Features

- JWT login/register flow
- Protected actions for post/comment management
- Feed with comments, publish/delete actions, and status badges
- Toast feedback for user actions
- User profile experience integrated into navigation (avatar fallback, upload, and instant refresh)

## Tech Stack

- React + Vite
- React Router
- Axios
- react-hot-toast
- Custom CSS

## Local Run

```bash
npm install
npm run dev
```

Default frontend API base URL is configured in `src/services/api.js`.

Current backend integrations include auth, posts, comments, and user profile upload (`POST /api/users/upload-profile`).

## Project Structure

```text
src/
  components/    # UI building blocks (Navbar, PostCard, PostForm)
  pages/         # Route pages (Feed, Login, Register)
  services/      # API and auth session helpers
  App.jsx        # Router and app-level auth state
  index.css      # Global styles
  main.jsx       # Entry point
```
