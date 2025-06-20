# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Book Review Client

## Setup Instructions

1.Clone repository
```git clone https://github.com/Jainamshah2425/Book_Review_System```
2.Directory for frontend
```cd client```
3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Directory for backend
    `cd server`
    `npm install`
6. Start node server
   `node server.js`



## Features

- User authentication (login/signup)
- Protected routes
- Book browsing and details
- User profiles
- Responsive design

## Authentication Flow

1. Users must sign up or log in to access the application
2. After successful authentication, users are redirected to the home page
3. All routes except login and signup are protected
4. JWT tokens are stored in localStorage for persistent sessions
5. Only Admin can add books

## Pages

- `/login` - User login
- `/signup` - User registration
- `/books` - Browse all books (protected)
- `/books/:id` - Book details (protected)
- `/users/:id` - User profile (protected)
