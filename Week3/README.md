# Week 3 – Logging, Testing & Report

### Goals:
- Monitor & log suspicious activity
- Document security patches
- Finalize GitHub submission

---

### Logs Captured (via Winston)
- Successful logins
- Failed login attempts
- Token issues
- Profile updates

> See `security.log` in the root directory

---

### Final Security Measures Implemented

| Feature                  | Tool        | Status |
|--------------------------|-------------|--------|
| Input Validation         | validator   | ✅     |
| Password Hashing         | bcrypt      | ✅     |
| JWT Authentication       | jsonwebtoken| ✅     |
| Secure Headers           | helmet      | ✅     |
| Logging                  | winston     | ✅     |

---

### Completed Tasks
- [x] Setup NodeGoat
- [x] Identified vulnerabilities
- [x] Applied mitigation using OWASP guidelines
- [x] Logged activities
- [x] Created a GitHub repo

---

### Submission Checklist

- ✅ GitHub repo with full code changes
- ✅ README for each week
- ✅ Screenshots of working app (in `/screenshots/`)
- ✅ Security log file (`security.log`)
