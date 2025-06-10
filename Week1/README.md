# Week 1 – Setup & Exploration

### Goals:
- Set up NodeGoat locally
- Explore existing vulnerabilities
- Understand the OWASP Top 10

### Steps Taken:
1. Cloned NodeGoat:
   ```bash
   git clone https://github.com/OWASP/NodeGoat.git
   cd NodeGoat
   npm install

2. Ran the app on Kali Linux:
   ```bash
   npm start

Visited http://localhost:4000 and explored routes

Noted OWASP vulnerabilities present:
- A1: Injection
- A3: XSS
- A5: Security Misconfig
- A7: Broken Access Control
- A9: Using Components with Known Vulnerabilities

### Outcome:
- Successfully ran NodeGoat on Kali
- Identified vulnerable routes for Week 2
