## Week 2 – Security Implementation

### Goals:
- Sanitize inputs
- Secure user credentials
- Implement JWT authentication
- Harden HTTP headers

---

### Fixes Applied

#### Input Validation (A1, A3)
- Used `validator` to sanitize and validate:
  - Email
  - Names
  - Bank account numbers

#### Password Hashing (A2: Broken Auth)
- Used `bcrypt` for secure password storage
- Hashes applied at registration

#### JWT Authentication (A2)
- Replaced session-based login with `jsonwebtoken`
- `/auth/login` returns a token
- Protected routes like `/profile` require `Authorization: Bearer <token>`

#### Helmet Integration (A5: Misconfig)
- Added `helmet` middleware to enforce:
  - Content-Security-Policy
  - Secure headers (X-Frame, X-Content-Type, etc.)

#### Logging
- Added `winston` logger for server and auth events
- Logs to both `console` and `security.log`

---

### Secure Endpoints:
- `POST /auth/signup`
- `POST /auth/login`
- `GET/POST /profile` (JWT-protected)

---

### Tools Used
- Postman for testing JWT-based API
- Kali Linux (localhost) for manual testing
