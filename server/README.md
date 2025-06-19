# Book Review Server

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the server directory with the following variables:
   ```
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   MONGO_URI=mongodb://localhost:27017/book_review
   PORT=5000
   ```

3. Make sure MongoDB is running on your system

4. Start the server:
   ```bash
   npm start
   ```

## Authentication Endpoints

- `POST /users/register` - Register a new user
- `POST /users/login` - Login user
- `GET /users/me` - Get current user (protected)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user (protected)

## Required Dependencies

- bcryptjs: For password hashing
- jsonwebtoken: For JWT authentication
- express: Web framework
- mongoose: MongoDB ODM
- cors: Cross-origin resource sharing
- dotenv: Environment variables 