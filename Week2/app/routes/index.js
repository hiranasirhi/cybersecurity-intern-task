// app/routes/index.js

"use strict";

const jwt = require("jsonwebtoken");
const AuthHandler = require("./auth");
const ProfileHandler = require("./profile");
const BenefitsHandler = require("./benefits");
const ContributionsHandler = require("./contributions");
const AllocationsHandler = require("./allocations");
const MemosHandler = require("./memos");
const ResearchHandler = require("./research");
const tutorialRouter = require("./tutorial");
const ErrorHandler = require("./error").errorHandler;
const SessionHandler = require("./session");

const JWT_SECRET = "your-secret-key";      // should match the one you used in auth.js
const JWT_ALGO   = { algorithms: ["HS256"] };

module.exports = (app, db) => {
  // ——————————————————————————————————————————————
  // 1) Mount Auth routes
  //    POST /auth/signup
  //    POST /auth/login
  // ——————————————————————————————————————————————
  const authRoutes = new AuthHandler(db);
  const sessionHandler = new SessionHandler(db); // ✅ declared first

  app.use("/auth", authRoutes);

  // ——————————————————————————————————————————————
  // 2) JWT verification middleware
  //    Expects `Authorization: Bearer <token>`
  // ——————————————————————————————————————————————
  function verifyToken(req, res, next) {
    const auth = req.headers.authorization || "";
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).send("Missing or malformed Authorization header");
    }

    jwt.verify(parts[1], JWT_SECRET, JWT_ALGO, (err, payload) => {
      if (err) return res.status(401).send("Invalid or expired token");
      req.jwtPayload = payload;      // e.g. { id: userId, iat:…, exp:… }
      next();
    });
  }

  // ——————————————————————————————————————————————
  // 3) Instantiate your business-logic handlers
  // ——————————————————————————————————————————————
  const profileHandler       = new ProfileHandler(db);
  const benefitsHandler      = new BenefitsHandler(db);
  const contributionsHandler = new ContributionsHandler(db);
  const allocationsHandler   = new AllocationsHandler(db);
  const memosHandler         = new MemosHandler(db);
  const researchHandler      = new ResearchHandler(db);

  // ——————————————————————————————————————————————
  // 4) Public routes (no auth)
  //    e.g. welcome page, but you can leave these to session if you want
  // ——————————————————————————————————————————————
  app.get("/", sessionHandler.displayWelcomePage);

  // ——————————————————————————————————————————————
  // 5) Protected routes (JWT)
  //    Replace your old `isLoggedIn` with `verifyToken`
  // ——————————————————————————————————————————————
  app.get("/login", sessionHandler.displayLoginPage);
  app.post("/login", sessionHandler.handleLoginRequest);

  app.get("/signup", sessionHandler.displaySignupPage);
  app.post("/signup", sessionHandler.handleSignup);

  app.get("/profile",     verifyToken, profileHandler.displayProfile);
  app.post("/profile",    verifyToken, profileHandler.handleProfileUpdate);

  app.get("/contributions", verifyToken, contributionsHandler.displayContributions);
  app.post("/contributions", verifyToken, contributionsHandler.handleContributionsUpdate);

  app.get("/benefits",     verifyToken, benefitsHandler.displayBenefits);
  app.post("/benefits",    verifyToken, benefitsHandler.updateBenefits);

  app.get("/allocations/:userId", verifyToken, allocationsHandler.displayAllocations);

  app.get("/memos",        verifyToken, memosHandler.displayMemos);
  app.post("/memos",       verifyToken, memosHandler.addMemos);

  app.get("/research",     verifyToken, researchHandler.displayResearch);

  // Tutorial remains public or you can protect it as you choose
  app.use("/tutorial", tutorialRouter);

  // ——————————————————————————————————————————————
  // 6) Global error handler
  // ——————————————————————————————————————————————
  app.use(ErrorHandler);
};
