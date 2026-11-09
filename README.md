# Backend User Profile API

A secure REST API for account registration, authentication, profile management, password changes, and personal settings. Authentication uses JWTs stored in HttpOnly cookies.

## Features

- User registration, login, and logout
- Protected profile retrieval and updates
- Profile name, bio, and phone management
- Password change with current-password verification
- Fresh authentication cookie after a password change
- bcrypt password hashing
- MongoDB persistence with Mongoose
- CORS credential support for browser clients
- Helmet security headers and request rate limiting
- Consistent `apiUrl` field in every JSON response
- `[API]` request logs with HTTP status codes
- Health endpoint and safe error responses

## Tech stack

- Node.js and Express
- MongoDB and Mongoose
- JSON Web Tokens
- bcryptjs
- cookie-parser
- Helmet
- express-rate-limit

## Requirements

- Node.js 20.19 or newer
- MongoDB running locally or a reachable MongoDB deployment

## Configuration

Copy `.env.example` to `.env`, then replace the JWT placeholder with a unique random value of at least 32 characters.

```env
PORT=1198
MONGO_URI=mongodb://127.0.0.1:27017/backend_user_profile_api
JWT_SECRET=change_me_generate_a_unique_random_secret_of_at_least_32_chars
NODE_ENV=development
CLIENT_ORIGINS=http://localhost:5173
COOKIE_SAME_SITE=lax
```

In production, provide trusted frontend origins as a comma-separated `CLIENT_ORIGINS` list. Cookies are always Secure in production; `COOKIE_SAME_SITE=none` is allowed only there. Never commit `.env` or real credentials.

## Install and run

```bash
npm install
npm run dev
```

The default API address is `http://localhost:1198`. The server validates `MONGO_URI`, `JWT_SECRET`, production origins, cookie settings, and the port before starting.

## API endpoints

Protected endpoints require the `token` HttpOnly cookie. Browser clients must send requests with credentials enabled.

### System

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/` | No | Service information |
| GET | `/health` | No | Health status |

### Authentication

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create an account and issue a cookie |
| POST | `/api/auth/login` | No | Verify credentials and issue a cookie |
| POST | `/api/auth/logout` | No | Clear the authentication cookie |

### Profile

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/profile` | Yes | Get the signed-in user's profile |
| PUT | `/api/profile/update` | Yes | Update name, bio, or phone |
| PUT | `/api/profile/change-password` | Yes | Change the password and refresh the cookie |
| PUT | `/api/profile/settings` | Yes | Update bio or phone only |

## Response format

Every JSON response starts with the requested API path.

```json
{
  "apiUrl": "/api/profile",
  "message": "Profile fetched successfully",
  "user": {}
}
```

Public error responses do not expose database, authentication, or internal server details.

Passwords must contain at least 8 characters and no more than 72 UTF-8 bytes. Changing a password increments the user's token version, invalidating existing cookies before a fresh cookie is issued. Logout also invalidates active cookies for the account. Rate limits are stored in memory per process; multi-instance deployments need a shared store.

## Browser request example

```js
fetch("http://localhost:1198/api/profile", {
  credentials: "include",
});
```

See [rest.http](./rest.http) for ready-to-run request examples.

## Author

**Ashish Ranjan**

Full-Stack Web Developer

## Links

- Portfolio: [ashishranjan.in](https://ashishranjan.in/)
- GitHub: [github.com/a2rp](https://github.com/a2rp)
- CodePen: [codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [facebook.com/theash.ashish](https://www.facebook.com/theash.ashish/)
- YouTube: [Ashish Ranjan](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- [Support page](https://a2rp-donation-page.netlify.app/)
- [Buy Me a Coffee](https://buymeacoffee.com/a2rp)
- [Patreon](https://www.patreon.com/a2rp)

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
