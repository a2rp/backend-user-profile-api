# Backend User Profile API Documentation

## Overview

This API manages one authenticated user's account profile. The API keeps the session token in an HttpOnly cookie, so browser JavaScript cannot read the token directly.

## Authentication flow

1. Register with `POST /api/auth/register`.
2. The password is hashed and the API sets the `token` HttpOnly cookie.
3. Send subsequent browser requests with `credentials: "include"`.
4. Read the signed-in profile from `GET /api/profile`.
5. Log out with `POST /api/auth/logout` to clear the cookie.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | HTTP port, defaults to `1198` |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign authentication tokens |
| `NODE_ENV` | No | Enables production cookie defaults when set to `production` |
| `CLIENT_ORIGIN` | No | Allowed browser origin, defaults to `http://localhost:5173` |
| `COOKIE_SECURE` | No | Override the cookie `secure` flag |
| `COOKIE_SAME_SITE` | No | Cookie SameSite policy |

## User fields

| Field | Details |
| --- | --- |
| `name` | Required trimmed string |
| `email` | Required, unique, lowercase email address |
| `password` | Required, minimum six characters, stored as a bcrypt hash |
| `bio` | Optional string up to 500 characters |
| `phone` | Optional phone value up to 20 characters |

## Profile routes

### Get profile

`GET /api/profile` returns the signed-in user's public profile. Password hashes are never included.

### Update profile

`PUT /api/profile/update` accepts one or more of `name`, `bio`, and `phone`. Empty names, oversized bios, and invalid phone formats are rejected.

### Change password

`PUT /api/profile/change-password` requires `currentPassword` and `newPassword`. The new password must be at least six characters and must differ from the current password. A new session cookie is set after a successful password change.

### Update settings

`PUT /api/profile/settings` accepts `bio` and `phone` only.

## Response and error behavior

Every JSON response includes `apiUrl` as its first field. The API returns public messages only, without raw database or token error details.

| Status | Meaning |
| --- | --- |
| `200` | Successful read, update, login, logout, or password change |
| `201` | Account created |
| `400` | Missing or invalid input |
| `401` | Missing or invalid authentication cookie |
| `404` | Requested route or user was not found |
| `409` | Email address already exists |
| `429` | Request limit exceeded |
| `500` | Unexpected server error |

## Security measures

- bcrypt hashes passwords before storage.
- JWTs are stored in an HttpOnly cookie.
- Cookie security settings adapt to local and production environments.
- Helmet supplies common security headers.
- Rate limiting reduces repeated requests.
- Protected routes reload the user from MongoDB.
- API logs request method, path, and final status without logging credentials.

## Local setup

```bash
copy .env.example .env
npm install
npm run dev
```

MongoDB must be available before you start the API.

## Author and support

**Ashish Ranjan**

Full-Stack Web Developer

- Portfolio: [ashishranjan.in](https://ashishranjan.in/)
- GitHub: [github.com/a2rp](https://github.com/a2rp)
- Email: [ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)
- Support: [a2rp-donation-page.netlify.app](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [buymeacoffee.com/a2rp](https://buymeacoffee.com/a2rp)
- Patreon: [patreon.com/a2rp](https://www.patreon.com/a2rp)
