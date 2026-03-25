# backend-user-profile-api

Backend API for user profile management, password change, and account settings using JWT and HttpOnly cookies.

## Features

- Register user
- Login user
- Logout user
- Get profile
- Update profile
- Change password
- Update account settings
- Protected routes
- JWT authentication
- HttpOnly cookie based auth
- MongoDB with Mongoose

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- cookie-parser

## Environment Variables

Create a .env file:

```bash
PORT=1201
MONGO_URI=mongodb://127.0.0.1:27017/backend_user_profile_api
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## API Endpoints

### Auth

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### Profile

- GET /api/profile
- PUT /api/profile/update
- PUT /api/profile/change-password
- PUT /api/profile/settings

### Notes

- Uses HttpOnly cookies for authentication
- Passwords are hashed using bcrypt
- Use withCredentials: true in frontend requests

## Follow Me

- GitHub: https://github.com/a2rp
- Portfolio: https://www.ashishranjan.net
- LinkedIn: https://www.linkedin.com/in/aashishranjan
- Facebook: https://www.facebook.com/theash.ashish/
- YouTube: https://www.youtube.com/@ashishranjan-ashz
